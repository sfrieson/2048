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
var display = {};
$(function(){
  //init
  var game = new Game(5);
  game.startingCells(2);
  game.display = $('<div>').attr('id', 'game').css({width: 110 * game.square, height: 110 * game.square});
  $('body').append(game.display);
  game.createDisplay(game.square);


  //key press events
  $(document).on('keydown', function(e){
    if(e.keyCode >= 37 && e.keyCode <= 40) {
      var oldState = clone(game.state),
					directions = {
						37: "left",
						38: "up",
						39: "right",
						40: "down"
					};
      game.move(direction[e.keyCode]);
      game.updateDisplay(oldState, game.square);
    }
  });
});


Game.prototype.createDisplay = function(len) {
  display.board = $('<div>').attr('id','board');
  for (var y = 0; y < len; y++){
    for (var x = 0; x < len; x ++){
      var cell = $('<div>').addClass('cell');
      var stateCell = this.state[y][x];
      if (stateCell){
        cell
        .html(
          $('<div>').addClass('number').text(Math.pow(2,stateCell.value))
        )
        .css('background-color', colors[stateCell.value]);

        stateCell.display = cell;
      }

      display.board.append( cell );
    }
  }
  this.display.html(display.board);
};


Game.prototype.updateDisplay = function(old, len) {
  var difference = diff(old, this.state, {fixedSizeArr:true});
  console.log(difference);
  for (var y = 0; y < len; y++){
    for (var x = 0; x < len; x ++){
      var cell = $('<div>').addClass('cell');
      var stateCell = this.state[y][x];
      if (stateCell){
        cell
        .html(
          $('<div>').addClass('number').text(Math.pow(2,stateCell.value))
        )
        .css('background-color', colors[stateCell.value]);

        stateCell.display = cell;
      }

      display.board.append( cell );
    }
  }
  this.display.html(display.board);
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
