
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
display.createDisplay(game);

//Event listening
$(document).on('keydown', function(e){
	var directions = {
		37: "left",
		38: "up",
		39: "right",
		40: "down",
		65: "left",
		87: "up",
		68: "right",
		83: "down"
	};
  if(directions[e.keyCode]) game.attemptMove(directions[e.keyCode]);
});

// events.on("after move", game.status, game);
