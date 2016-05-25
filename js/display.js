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
		},
		end: {
			width: "100px",
			height: "100px",
			borderRadius: "10px",
		}
	}
};

$(function(){
	events.on("slide", display.updateTile);
	events.on("merge", display.updateTile);
	events.on("remove", display.removeTile);
	events.on("new tile", display.updateTile);
});

display.createDisplay = function(game) {
	game.display.append(
		// this.createScoreboard(game.currentScore),
		this.createBoard(game.state)
	);
};

display.createScoreboard = function(){
	this.score = $('<div>').addClass('score').text('0');
	return display.score;
};

display.createBoard = function(state){
	this.board = $('<div>').attr('id','board');
  state.each(function(stateCell){
		var cell = $('<div>').addClass('cell');
		if (stateCell.tile){
			this.updateTile(stateCell.tile);
		}
		this.board.append( cell );
	}.bind(this));

	return display.board;
};

display.updateTile = function(tile) {
	if (tile.display) tile.display.removeClass("new merged");
	var id = tile.y + "x" + tile.x,
			$number = $('<div>').addClass('number').text(Math.pow(2,tile.value)),
			basicCss = {
				top: tile.y * 110 + tile.y * 4,
				left: tile.x * 110,
				backgroundColor: colors[tile.value]
			};
	if(tile.status === "new") {
		tile.display = $('<div>').addClass('new tile');
		display.tiles.append(tile.display);
	}
	if(tile.status === "merged") tile.display.addClass('merged');

	tile.display
	.removeAttr('id')
	.attr('id', id)
	.css(basicCss)
	.html($number);
};

display.removeTile = function(tile){
	tile.display.remove();
	tile = null;
};
