(function(){
//init
var square = 4,
		startingCells = 2,
		game = new Game(square,startingCells);


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
  if(directions[e.keyCode]) {
		e.preventDefault();
		game.attemptMove(directions[e.keyCode]);
	}
});

})();
