var Game = function (sq) {
	//length and width of square
	this.square = sq;
	//Game board
	this.state = 	[];
	this.cells = [];
	//List of empty cells
	this.empties = function (){
		var cells = [];
		for (var y = 0; y < sq; y++){
			for (var x = 0; x < sq; x++){
				if(!this.state[y][x].tile) cells.push(this.state[y][x]);
			}
		}
		return cells;
	};
  for (var y = 0; y < sq; y++){
		this.state.push([]);
		for (var x = 0; x < sq; x++){
			var cell = new Cell(y,x);
			this.state[y].push(cell);
			this.empties.push(cell);
		}
	}
	this.moves = 0;
};

//Set up board
Game.prototype.startingCells = function (num) {
	while(num--) this.addCell();
};

//Add new Cell to random position
Game.prototype.addCell = function () {
	if(this.empties.length){
		//remove a random cell from empties list
		var position = sample.call(this.empties);
		// console.log(position);
		//make a new cell there on the board
		var cell = new Cell(null, this.moves, position.y, position.x);
		// console.log(this.state, cell);
		this.state[cell.y][cell.x] = cell;
		this.cells.push(cell);
	}
	else console.log("Game Over"); //TODO: Game Over???
};

//Array sample method
function sample(arr){
	arr = arr || this;
	return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
}

//Handes the players move
Game.prototype.move = function(direction){
	this.moves++;
	//highest index;
	var high = this.square - 1;
	//set up directional information based on which way player desires to move
	var moveOpt = direction === "right" || direction === "down" ?
		{ y:high, x:high, end: 0, dir: 1} :
		{ y:0, x:0, end: high, dir: -1};

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

Game.prototype.slide = function(cell,dir,focus,prevEmpties){
	var slidingAxis = focus === "x" ? "y" : "x";
	var oldPos = {x: cell.x, y: cell.y};
	cell[slidingAxis] += dir * prevEmpties; //move cell position attribute
	// console.log(focus, dir, prevEmpties, "\n", oldPos, {y:cell.y,x:cell.x});

	this.state[cell.y][cell.x] = cell;
	this.state[oldPos.y][oldPos.x] = null;

	//Swap positions in empty list
	// this.empties[this.empties.indexOf(`${cell.y},${cell.x}`)] = `${oldPos.y},${oldPos.x}`;

	//return new position
	return {x:cell.x,y:cell.y};
};

Game.prototype.mergeCheck = function(cell, focus, dir){
	var neighbor = focus === "x" ?
		{x: cell.x, y: cell.y + dir} :
		{x: cell.x + dir, y: cell.y};

		console.log({y:cell.y, x:cell.x}, neighbor, cell.value, this.state[neighbor.y][neighbor.x]);

	//Check if the value is the same as it's neighbor's
	if(this.state[neighbor.y] && this.state[neighbor.y][neighbor.x] &&
		cell.value === this.state[neighbor.y][neighbor.x].value &&
		this.moves !== this.state[neighbor.y][neighbor.x].creation){
			this.state[cell.y][cell.x] = null;
			this.state[neighbor.y][neighbor.x] = new Cell(cell.value, this.moves);

			//Add current to empties list and focus empties count
			this.empties.push({y: cell.y,x: cell.x});


			return true;
		}
	else return false;
};

//Finds the board movement with options from move.
Game.prototype.slideCheck = function(move) {
	//Add to slide counter (statistics)

	//Set up variables for looping through game state
	var slides = 0,
			focusEmpties = {},
			currentCell;

	//A count for empty cells in each row in the focus direction
	for (var i = 0; i < this.square; i++) focusEmpties[i] = 0;

	//Loop through game state the opposite direction of slide
	while(move.y != move.end - move.dir) {
		while(move.x != move.end - move.dir) {
			currentCell = this.state[move.y][move.x];

			//Check if cell is empty (for future sliding)
			if (currentCell === null) focusEmpties[move[move.focus]]++;
			else {

				//Slide cell if there were preceeding focusEmpties
				if(focusEmpties[move[move.focus]]){
					slides++;
					this.slide(currentCell,move.dir,move.focus,focusEmpties[move[move.focus]]);
				}


				if(this.mergeCheck(currentCell, move.focus, move.dir)){
					slides++;
					focusEmpties[move[move.focus]]++;
				}
			}
			move.x -= move.dir;//next cell in opposite direction of slide way
		}
		move.x = Math.abs(move.x - (this.square - 1) + move.dir); //reset x for next iteration
		move.y -= move.dir; //new row in opposite direction of slide way
	}

	//After move is done, add a new Cell if there was a slide;
	//If none, remove that slide from the count
	if(slides) this.addCell();
	else this.moves--;
};

var Cell = function (y, x) {
	this.x = x;
	this.y = y;
};

var Tile = function (value, moves, y, x) {
	this.creation = moves;
	this.y = y;
	this.x = x;
	if (value){
		this.status = "merged";
		this.value = ++value;
	} else {
		this.status = "new";
		this.value = Math.random() < 0.9 ? 1 : 2;
	}
}

// Tile.prototype.merge = function(moves) {
// 	this.value++;
// 	this.color = colors[this.value];
// 	this.creation = moves;
// };

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

Game.prototype.status = function() {

	var board = "";
	for(var y = 0; y < this.square; y++){
		for(var x = 0; x < this.square; x++){
			board += '[';
			if (this.state[y][x]) board+= Math.pow(2, this.state[y][x].value);
			else board += " ";
			board += ']';
		}
		board += "\n";
	}
	console.log(board);
};
