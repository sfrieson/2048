var lastEvent;
$(function(){
  var game = new Game();
  game.startingCells(2);
  game.display = $('<div>').attr('id', 'game');
  $('body').append(game.display);
  game.updateDisplay();

  $(document).on('keydown', function(e){
    if(e.keyCode >= 37 && e.keyCode <= 40) {
      var direction;
      if(e.keyCode === 37) direction = "left";
      if(e.keyCode === 38) direction = "up";
      if(e.keyCode === 39) direction = "right";
      if(e.keyCode === 40) direction = "down";
      game.move(direction);
    }
    game.updateDisplay();
  });
});

Game.prototype.updateDisplay = function() {
  var board = $('<div>').attr('id','board');
  for (var y = 0; y < 4; y++){
    for (var x = 0; x < 4; x ++){
      var cell = $('<div>').addClass('cell');
      var state = this.state[y][x];
      if (state){
        cell
        .html(
          $('<div>').addClass('number').text(state.value)
        )
        .css('background-color', state.color);
      }
      board.append( cell );
    }
    // board.append('<br>');
  }
  this.display.html(board);
};
