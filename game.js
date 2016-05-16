// var matrix = require('./lib/matrix');
var Game = function (sq, starters) {
	if(arguments.length < 2) throw new TypeError("You must supply two arguments: width of game matrix and number of starting tiles.");
	//length and width of board matrix
	this.square = sq;
	this.empties = [];
	//Game board
	this.state = 	matrix(sq);
	this.state.each(function(_cell,y,x,state){
		var cell = new Cell(y,x);
		state[y][x] = cell;
		this.empties.push(cell);
	}.bind(this)); //for this.empties
	this.tiles = [];
	this.moves = 0;

	//Add starting tiles
	while(starters--) this.addTile();
};

//Add new Tile to random position
Game.prototype.getEmpties = function() {
	var empties = [];
	this.state.each(function(cell){
		if(!cell.tile) empties.push(cell);
	});
	this.empties = empties;
	return !!empties.length;
};


Game.prototype.addTile = function () {
	if(this.getEmpties()){
		//remove a random cell from empties list
		var cell = sample.call(this.empties);
		// console.log(position);
		//make a new tile there on the board
		var tile = new Tile(this.moves, cell);
		// console.log(this.state, tile);
		cell.tile = tile;
		this.tiles.push(tile);
	}
	else console.log("Game Over"); //TODO: Game Over???
};

//Handles the players move
Game.prototype.move = function(direction){
	this.moves++;

	//set up directional information based on which way player desires to move
	var moveOpt = direction === "right" || direction === "down" ? {dir: 1} : { dir: -1};

	moveOpt.focus = direction === "right" || direction === "left" ? "y" : "x";
	// dir === 'right' || dir === 'left'
	//  =========
	//  | | | | |
	//  ---------
	//  | | | | |
	//  ---------
	// [| | |2|2|] <-- focus is a row (y=2)
	//  ---------
	//  | | | | |
	//  =========

	this.slideCheck(moveOpt);
};

//Finds the board movement with options from move.
Game.prototype.slideCheck = function(move) {
	//Set up variables for looping through game state
	var slides = 0,
			focusEmpties = {};

	//A count for empty cells in each row in the focus direction
	for (var i = 0; i < this.square; i++) focusEmpties[i] = 0; //TODO: remove this somehow

	//Loop through game state the opposite direction of slide
	this.state.traverse(function(cell, y, x, state){
		//TODO: remove these somehow
		move.x = x;
		move.y = y;
		//Check if cell is empty (for future sliding)
		console.log("x: " + x + " y: " + y);
		console.log("move:", move);
		if (!cell.tile) focusEmpties[move[move.focus]]++;
		else {
			console.log("focusEmpties:", focusEmpties);
			console.log("focusEmpties[move[move.focus]]:", focusEmpties[move[move.focus]]);
			//Slide cell if there were preceeding focusEmpties
			if(focusEmpties[move[move.focus]]){
				var newPos = this.slide(cell, cell.tile, move.dir, move.focus, focusEmpties[move[move.focus]]);
				cell = state[newPos.y][newPos.x];
				slides++;
			}
			console.log("cell after slide:",cell);
			if(this.mergeCheck(cell.tile, move.focus, move.dir)){
				//if there was a merge, add one to the empties list.
				focusEmpties[move[move.focus]]++;
				slides++;
			}
		}
	}.bind(this),{increment: -move.dir});

	//After move is done, add a new Tile if there was a slide
	if(slides) this.addTile();
	//If none, remove that slide from the count
	else this.moves--;
};

Game.prototype.slide = function(cell,tile,dir,focus,prevEmpties){
	var slidingAxis = focus === "x" ? "y" : "x";
	//move tile position attribute
	tile[slidingAxis] += dir * prevEmpties;
	// console.log(focus, dir, prevEmpties, "\n", oldPos, {y:tile.y,x:tile.x});

	//new position
	this.state[tile.y][tile.x].tile = tile;

	//starting position
	cell.tile = null;
	//return new position
	return {x:tile.x,y:tile.y};
};

Game.prototype.mergeCheck = function(tile, focus, dir){
	var neighbor = focus === "x" ?
		{x: tile.x, y: tile.y + dir} :
		{x: tile.x + dir, y: tile.y};


	//Check if the value is the same as it's neighbor's
	if(!this.state[neighbor.y] || !this.state[neighbor.y][neighbor.x]) return false;
	neighbor = this.state[neighbor.y][neighbor.x]; //grab the neighbor cell
	if(!neighbor.tile || neighbor.tile.updated === this.moves) return false; // no neighbor or already merged
	if(neighbor.tile.value != tile.value) return false;
	else {
		this.state[tile.y][tile.x].tile = null;
		neighbor.tile.merge(this.moves);

		//Add current to empties list
		this.empties.push({y: tile.y,x: tile.x});

		return true;
	}
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
};

Tile.prototype.merge = function(moves) {
	this.status = "merged";
	this.value++;
	this.updated = moves;
};

//rethink empties data structure


var r = function() {
	game.move("right");
	game.status();
};

var l = function() {
	game.move("left");
	game.status();
};

var u = function() {
	game.move("up");
	game.status();
};

var d = function() {
	game.move("down");
	game.status();
};

//Array sample method
function sample(arr){
	arr = arr || this;
	return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
}
