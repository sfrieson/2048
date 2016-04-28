var pushes = 0;
var colors = {
	2: 		"yellow",
	4: 		"yellow",
	8: 		"orange",
  16: 	"red",
  32: 	"violet",
  64: 	"indigo",
  128: 	"blue",
  256: 	"green"
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
};

//Set up board
Game.prototype.init = function () {
	this.addCell();
	this.addCell();
};

//Add new Cell to random position
Game.prototype.addCell = function () {
	if(this.empties.length){
		//remove random cell from empties list
		var position = sample.call(this.empties);

		//make a new cell there on the board
		this.state[position.charAt(0)][position.charAt(2)] = new Cell();
	}
	else console.log("Game Over"); //TODO: Game Over???
};

//Array sample method
function sample(arr){
	arr = arr || this;
	return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
}


Game.prototype.push = function(way) {
	//Add to push counter (statistics)
	pushes++;

	//set up directional information based on which way player pushed
	var pos, end, direction, focus;
	if( way === "right" || way === "down" ) {
		pos = {y:3, x:3};
		end = 0;
		direction = 1;
	} else {
		pos = {y:0, x:0};
		end = 3;
		direction = -1;
	}
	focus = way === "right" || way === "left" ? "y" : "x";
	// way === 'right' || way === 'left'
	//  =========
	//  | | | | |
	//  ---------
	//  | | | | |
	//  ---------
	// [| | |2|2|] <-- focus is a row (y=2)
	//  ---------
	//  | | | | |
	//  =========

	//Set up variables for looping through game state
	var focusEmpties = {0:0,1:0,2:0,3:0},
			currentCell, newPos, slides = 0;

	//Loop through game state the opposite direction of push
	while(pos.y != end - direction) {
		while(pos.x != end - direction) {
			newPos = null;
			currentCell = this.state[pos.y][pos.x];

			//Check if cell is empty (for future sliding)
			if (currentCell === null) focusEmpties[pos[focus]]++;
			else {

				//Slide cell if there were preceeding focusEmpties
				if(focusEmpties[pos[focus]]){
					slides++;
					newPos = focus === "x" ?
						{x: pos.x, y: pos.y + (direction * focusEmpties[pos[focus]])} :
						{x: pos.x + (direction * focusEmpties[pos[focus]]), y: pos.y};

					this.state[newPos.y][newPos.x] = currentCell;
					this.state[pos.y][pos.x] = null;

					//Swap positions in empty list
					this.empties[this.empties.indexOf(`${newPos.y},${newPos.x}`)] = `${pos.y},${pos.x}`;
				}

				//Get the current position of target cell
				//it may or may not have slid
				newPos = newPos || pos;
				var neighborPos = focus === "x" ?
					{x: newPos.x, y: newPos.y + direction} :
					{x: newPos.x + direction, y: newPos.y};
				console.log("current:", newPos, "neighbor:", neighborPos);

				//Check if the value is the same as it's neighbor's
				if(this.state[neighborPos.y] && this.state[neighborPos.y][neighborPos.x] &&
					currentCell.value === this.state[neighborPos.y][neighborPos.x].value){
						slides++;
						this.state[newPos.y][newPos.x] = null;
						this.state[neighborPos.y][neighborPos.x].merge();

						//Add current to empties list and focus empties count
						this.empties.push(`${newPos.y},${newPos.x}`);
						focusEmpties[pos[focus]]++;
					}
			}
			pos.x -= direction;//next cell in opposite direction of push way
		}
		pos.x = Math.abs(pos.x - 3 + direction); //reset x for next iteration
		pos.y -= direction; //new row in opposite direction of push way
	}

	//After move is done, add a new Cell if there was a slide;
	if(slides) this.addCell();
};


var Cell = function (value) {
	value = value || Math.random() < 0.85 ? 2 : 4;
	this.value = value;
	this.color = colors[this.value];
};

Cell.prototype.merge = function() {
	this.value *= 2;
	this.color = colors[this.value];
};

//rethink empties data structure
