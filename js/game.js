var Game = function (sq, starters) {
	if(arguments.length < 2) throw new TypeError("You must supply two arguments: width of game matrix and number of starting tiles.");
	//length and width of board matrix
	this.empties = [];
	this.removed = [];
	this.currentScore = 0;

	//Game board
	this.state = 	matrix(sq);
	this.state.each(function(_matrixCell,y,x,state){
		var cell = new Cell(y,x);
		state[y][x] = cell;
		this.empties.push(cell);
	}.bind(this)); //for this.empties
	this.tiles = [];
	this.moves = 0;

	//Add starting tiles
	while(starters--) this.addTile();

	events.on("after slides", this.getEmpties, this);
	events.on("empties found", this.addTile, this);
	events.on("merge", this.score, this);
};

//Find all empty tiles
Game.prototype.getEmpties = function() {
	this.empties = this.state.filter(function(cell){
		return !cell.tile;
	});
	if (this.empties.length){
		events.emit("empties found");
		events.emit("after move");
	}
	else events.emit("game over");

};

Game.prototype.score = function(scoringTile) {
	this.currentScore += scoringTile.value;
	events.emit("score");
}
//Add new Tile to random position
Game.prototype.addTile = function () {
	//remove a random cell from empties list
	var cell = sample.call(this.empties);

	//make a new tile there on the board
	var tile = new Tile(this.moves, cell);

	cell.tile = tile;
	this.tiles.push(tile);
};

//Handles the players move
Game.prototype.attemptMove = function(direction, cb){
	//set up directional information based on which way player desires to move
	var moveOpt = direction === "right" || direction === "down" ? {dir: 1} : { dir: -1};

	moveOpt.focus = direction === "right" || direction === "left" ? "y" : "x";
	// if dir === 'right' or dir === 'left'...
  //     0  1  2  3
	//  0 [ ][ ][ ][ ]
	//  1 [ ][ ][ ][ ]
	//  2 [ ][ ][4][4] <-- ...focus is a row (y=2)
	//  3 [ ][ ][ ][ ]

	events.emit("before move");

	this.moves++;
	if(this.slideCheck(moveOpt)) events.emit("after slides");
	else this.moves--;
};

//Finds the board movement with options from move.
Game.prototype.slideCheck = function(move) {
	//Set up variables for looping through game state
	var slid = false,
			empties = [];

	//empties default at 0;
	for(var i = 0; i < this.state.length; i++) empties[i] = 0;

	//Loop through game state the opposite direction of slide
	this.state.traverse(function(cell, y, x, state){
		//Always have the value of the index of the focus axis for the empties
		move.focusIndex = move.focus === "x" ? x : y;

		//Check if cell is empty (for future sliding)
		if (!cell.tile) empties[move.focusIndex]++;
		else {
			//record old position for animation
			cell.tile.prevPos = {y:cell.y, x:cell.x};
			cell.tile.status = null;

			//Slide cell if there were preceeding focusEmpties
			if(empties[move.focusIndex]){
				var newPos = this.slide(cell, cell.tile, move.dir, move.focus, empties[move.focusIndex]);
				cell = state[newPos.y][newPos.x];
				slid = true;
			}

			//if there's a merge, add one to the empties list.
			if(this.mergeCheck(cell.tile, move.focus, move.dir)){
				empties[move.focusIndex]++;
				slid = true;
			}
		}
	}.bind(this),{increment: - move.dir}); //traverse options
	//After move is done, add a new Tile if there was a slide
	return slid;
};

Game.prototype.slide = function(cell,tile,dir,focus,prevEmpties){
	var slidingAxis = focus === "x" ? "y" : "x";
	//move tile's position attribute
	tile[slidingAxis] += dir * prevEmpties;

	//new position
	this.state[tile.y][tile.x].tile = tile;

	//starting position
	cell.tile = null;
	//return new position
	events.emit('slide', [tile]);
	return {x:tile.x,y:tile.y};
};

Game.prototype.mergeCheck = function(tile, focus, dir){
	var currentCell = this.state[tile.y][tile.x],
	neighbor = focus === "x" ?
		{x: tile.x, y: tile.y + dir} :
		{x: tile.x + dir, y: tile.y};


	//Check if the value is the same as it's neighbor's
	if(!this.state[neighbor.y] || !this.state[neighbor.y][neighbor.x]) return false;
	neighbor = this.state[neighbor.y][neighbor.x]; //grab the neighbor cell
	if(!neighbor.tile || neighbor.tile.updated === this.moves) return false; // no neighbor or already merged
	if(neighbor.tile.value != tile.value) return false;
	else {
		this.mergeTiles(neighbor.tile, tile);
		return true;
	}
};

Game.prototype.mergeTiles = function (effected, removed){
	this.removeTileFromCell(removed);
	effected.merge(this.moves);
	this.tiles.splice(this.tiles.indexOf(removed), 1);

	//Add removed to empties list
	this.empties.push({y: removed.y,x: removed.x});
};

Game.prototype.removeTileFromCell = function (tile) {
	// var axis = focus === "x" ? "y" : "x";
	tile.remove(this.moves);
	this.removed.push(tile);
	this.state[tile.y][tile.x].tile = null;
};

Game.prototype.status = function() {
	var board = "   0  1  2  3 ";

	this.state.traverse(function(cell, y, x){
		if(x === 0) board += "\n" + y + " ";
		board += '[';
		if(cell.tile) board += cell.tile.value;
		else board += " ";
		board += ']';
	});

	console.log(board);
};

var Cell = function (y, x) {
	this.x = x;
	this.y = y;
	this.tile = null;
};

var Tile = function (moves, cell) {
	cell.tile = this;
	this.updated = moves;
	this.y = cell.y;
	this.x = cell.x;
	this.status = "new";
	this.value = Math.random() < 0.9 ? 1 : 2;
	events.emit("new tile", [this]);
};

Tile.prototype.merge = function(moves) {
	this.status = "merged";
	this.value++;
	this.updated = moves;
	events.emit("merge", [this]);
};

Tile.prototype.remove = function(moves, direction) {
	this.status = "removed";
	this.value = -1;
	this.updated = moves;
	// this.direction = direction;
	events.emit("remove", [this]);
};


//Array sample method
function sample(arr){
	arr = arr || this;
	return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
}
