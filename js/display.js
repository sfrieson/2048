var colors = {
	1: 		"beige",
	2: 		"yellow",
	3: 		"gold",
  4: 	"orange",
  5: 	"red",
  6: 	"darkred",
  7: 	"indigo",
  8: 	"purple",
	9:	"violet",
	10:	"skyblue",
	11:	"lightgreen",
	12:	"green",
	13:	"darkgreen",
};
var display = {
	new: {
		start:{
			width: "5px",
			height: "5px",
			borderRadius: "50%",
			transform: "translate(50px,50px)",
		},
		end: {
			width: "100px",
			height: "100px",
			borderRadius: "10px",
			transform: "translate(0,0)"
		}
	},
	merged: {
		start:{
			width: "5px",
			height: "5px",
			borderRadius: "50%",
			// transform: "translate(50px,50px)",
		},
		end: {
			width: "100px",
			height: "100px",
			borderRadius: "10px",
			// transform: "translate(0,0)"
		}
	}
};
$(function(){
  //init
	var square = 4,
			startingCells = 2,
  		game = new Game(square,startingCells);
	window.game = game;//TODO: remove this variable
  game.display = $('#game')
	.css({width: 110 * square, height: 110 * square});
  $('body').append(game.display);

	display.tiles = $('<div>').addClass('tile-container');
	game.display.append(display.tiles);
  game.createDisplay();

  //key press events
  $(document).on('keydown', function(e){
    if(e.keyCode >= 37 && e.keyCode <= 40) {

			var directions = {
				37: "left",
				38: "up",
				39: "right",
				40: "down"
			};
      if(game.attemptMove(directions[e.keyCode])) game.updateDisplay();
    }
  });
});


Game.prototype.createDisplay = function() {
	this.display.append(
		// this.createScoreboard(),
		this.createBoard()
	);
};

Game.prototype.createScoreboard = function(){
	display.score = $('<div>').addClass('score').text('0');
	return display.score;
};

Game.prototype.createBoard = function(){
	display.board = $('<div>').attr('id','board');
  this.state.each(function(stateCell){
		var cell = $('<div>').addClass('cell');
		if (stateCell.tile){
			this.updateTile(stateCell.tile);
		}
		display.board.append( cell );
	}.bind(this));

	return display.board;
};


Game.prototype.updateTile = function(tile) {
	var id = tile.y + "x" + tile.x,
			$number = $('<div>').addClass('number').text(Math.pow(2,tile.value)),
			basicCss = {
				top: tile.y * 110 + tile.y * 4,
				left: tile.x * 110,
				backgroundColor: colors[tile.value]
			};

	if(tile.display) tile.display.removeClass("new merged");
	//If tile is new or merged on this move
	if(tile.updated === this.moves){
		if(tile.status === "new"){
			tile.display = $('<div>')
			.addClass('new tile')
			.html($number);
			display.tiles.append(tile.display);
		}
		if(tile.status === "merged"){
			tile.display
			.removeAttr('id')
			.addClass('merged')
			.html($number);
		}
	}
	//tile slid or stayed still
	else {
		tile.display
		.removeAttr('id')
		.html($number);
	}
	tile.display
	.attr('id', id)
	.css(basicCss);
};

Game.prototype.removeOld = function(){
	while(this.removed.length) this.removeTile(this.removed.pop());
};

Game.prototype.removeTile = function(tile){
	tile.display.remove();
	tile = null;
};


Game.prototype.updateDisplay = function() {
	this.removeOld();
	this.tiles.forEach(function(tile){
		//If there is a tile, update that cell
		this.updateTile(tile);
	}.bind(this));
};



function clone(obj) {
  var copy;

// Handle the 3 simple types, and null or undefined
if (obj === null ||  typeof obj !== "object") return obj;

// Handle Date
if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
}

// Handle Array
if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = clone(obj[i]);
    }
    return copy;
}

// Handle Object
if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
}

throw new Error("Unable to copy obj! Its type isn't supported.");
}
