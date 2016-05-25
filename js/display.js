var colors = {
	1: 	"beige",
	2: 	"yellow",
	3: 	"gold",
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
colors = {
	1: 	"#40FFD3",
	2: 	"#3BE0E8",
	3: 	"#4DC8FF",
  4: 	"#3B85E8",
  5: 	"#4060FF",
  6: 	"#433BFF",
  7: 	"#6E36E8",
  8: 	"#B348FF",
	9:	"#CF36E8",
	10:	"#FF3BD0",
	11:	"#FF3F73",
	12:	"#E84539",
	13:	"#FF6F33",
};

var display = {
	scoreboard: $('<div>').addClass('scoreboard').text('0'),
	board: $('<div>').attr('id','board'),
	tiles: $('<div>').addClass('tile-container'),

	moveScore: 0,
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

display.createDisplay = function(game) {
	game.container = $('#game-container');

	game.display = $('<figure>')
	.attr('id','game')
	.css({width: 110 * game.state.length, height: 110 * game.state.length})
	.append(
		this.createBoard(game.state)
	);

	game.container.append(
		display.scoreboard,
		game.display
	);
	game.display.append(display.tiles);
};


display.clearMoveScore = function(scoringTile) {
	this.moveScore = 0;
};
display.addToMoveScore = function(additionalPoints){
	this.moveScore += Math.pow(2, additionalPoints);
};
display.showMoveScore = function(){
	currentScore = parseInt(this.scoreboard.text(),10);
	this.scoreboard.text(currentScore + this.moveScore);
	this.moveScore = 0;
};

display.createBoard = function(state){
  state.each(function(stateCell){
		var cell = $('<div>').addClass('cell');
		if (stateCell.tile){
			this.updateTile(stateCell.tile);
		}
		this.board.append( cell );
	}.bind(this));

	this.board.append(this.tiles);
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
		this.tiles.append(tile.display);
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


events.on("new game", display.createDisplay, display);
events.on("slide", display.updateTile, display);
events.on("merge", display.updateTile, display);
events.on("remove", display.removeTile, display);
events.on("new tile", display.updateTile, display);
events.on("score", display.addToMoveScore, display);
events.on("after move", display.showMoveScore, display);
