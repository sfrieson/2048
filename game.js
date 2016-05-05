var slides = 0;
var colors = {
	2: 		"beige",
	4: 		"yellow",
	8: 		"gold",
  16: 	"orange",
  32: 	"red",
  64: 	"darkred",
  128: 	"indigo",
  256: 	"purple",
	512:	"violet",
	1024:	"skyblue",
	2048:	"lightgreen",
	4096:	"green",
	8192:	"darkgreen",
};

var Game = function () {
	//Game board
	this.state = 	[[null,null,null,null],
								 [null,null,null,null],
								 [null,null,null,null],
								 [null,null,null,null]];

	//Currently empty cells (all at start)
	this.empties = 	['0,0','0,1','0,2','0,3',
									 '1,0','1,1','1,2','1,3',
									 '2,0','2,1','2,2','2,3',
									 '3,0','3,1','3,2','3,3'];

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

		//make a new cell there on the board
		this.state[position.charAt(0)][position.charAt(2)] = new Cell(null, this.moves);
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
	//set up directional information based on which way player desires to move
	var moveOpt = direction === "right" || direction === "down" ?
		{ y:3, x:3, end: 0, dir: 1} :
		{ y:0, x:0, end: 3, dir: -1};

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

Game.prototype.slide = function(x,y,dir,focus,prevEmpties){
	var newPos = focus === "x" ?
		{x: x, y: y + (dir * prevEmpties)} :
		{x: x + (dir * prevEmpties), y: y};

	this.state[newPos.y][newPos.x] = this.state[y][x];
	this.state[y][x] = null;

	//Swap positions in empty list
	this.empties[this.empties.indexOf(`${newPos.y},${newPos.x}`)] = `${y},${x}`;

	//return new position
	return newPos;
};

Game.prototype.mergeCheck = function(cell, pos, focus, dir){
	var neighbor = focus === "x" ?
		{x: pos.x, y: pos.y + dir} :
		{x: pos.x + dir, y: pos.y};

	//Check if the value is the same as it's neighbor's
	if(this.state[neighbor.y] && this.state[neighbor.y][neighbor.x] &&
		cell.value === this.state[neighbor.y][neighbor.x].value &&
		this.moves !==this.state[neighbor.y][neighbor.x].creation){
			this.state[pos.y][pos.x] = null;
			this.state[neighbor.y][neighbor.x].merge(this.moves);

			//Add current to empties list and focus empties count
			this.empties.push(`${pos.y},${pos.x}`);

			return true;
		}
	else return false;
};

//Finds the board movement with options from move.
Game.prototype.slideCheck = function(move) {
	//Add to slide counter (statistics)
	slides++;

	//Set up variables for looping through game state
	var focusEmpties = {0:0,1:0,2:0,3:0},
			slides = 0,
			currentCell, pos;

	//Loop through game state the opposite direction of slide
	while(move.y != move.end - move.dir) {
		while(move.x != move.end - move.dir) {
			pos = null;
			currentCell = this.state[move.y][move.x];

			//Check if cell is empty (for future sliding)
			if (currentCell === null) focusEmpties[move[move.focus]]++;
			else {

				//Slide cell if there were preceeding focusEmpties
				if(focusEmpties[move[move.focus]]){
					slides++;
					pos = this.slide(move.x,move.y,move.dir,move.focus,focusEmpties[move[move.focus]]);
				}

				//Get the current position of target cell
				//it may or may not have slid
				pos = pos || {y: move.y, x: move.x};

				if(this.mergeCheck(currentCell, pos, move.focus, move.dir)){
					slides++;
					focusEmpties[move[move.focus]]++;
				}
			}
			move.x -= move.dir;//next cell in opposite direction of slide way
		}
		move.x = Math.abs(move.x - 3 + move.dir); //reset x for next iteration
		move.y -= move.dir; //new row in opposite direction of slide way
	}

	//After move is done, add a new Cell if there was a slide;
	//If none, remove that slide from the count
	if(slides) this.addCell();
	else slides--;
};

var Cell = function (value, moves) {
	value = value || Math.random() < 0.9 ? 2 : 4;
	this.value = value;
	this.color = colors[this.value];
	this.creation = moves;
};

Cell.prototype.merge = function(moves) {
	this.value *= 2;
	this.color = colors[this.value];
	this.creation = moves;
};

//rethink empties data structure

var r = function() {
	game.move("right");
	return game.state;
};

var l = function() {
	game.move("left");
	return game.state;
};

var u = function() {
	game.move("up");
	return game.state;
};

var d = function() {
	game.move("down");
	return game.state;
};
