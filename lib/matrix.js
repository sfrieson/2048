var matrix = (function(){
var matrix = function(width, height){
  height = height || width;
  var matr = Object.create(matrix.prototype);
  for(var y = 0; y < height; y++){
    matr.push([]);
    for(var x = 0; x < width; x++){
      matr[y].push(null);
    }
  }
  return matr;
};

matrix.prototype = Object.create(Array.prototype);

matrix.prototype.traverse = function(fn, options){
  var opt = parseOptions(options, this.length);
  // console.log(opt);
  // Looping
  // console.log("col:",opt.col);
  loop[opt.col.comp](opt.col.start, opt.col.end, opt.col.inc,
    function(y){//body of outer
      //get extra row options
      addRowOptions(opt.row, this[y]);
      // console.log("row:",opt.row);
      loop[opt.row.comp](opt.row.start, opt.row.end, opt.row.inc,
        function(x){fn(this[y][x], y, x, this);}.bind(this)); //body of inner
  }.bind(this));
};

matrix.prototype.each = matrix.prototype.traverse;
matrix.prototype.fill = function(arr){
  var currentIndex = 0;
  this.each(function(_cell, y, x){
    this[y][x] = arr[currentIndex++];
  }.bind(this));
  return arr.slice(currentIndex);
};
matrix.prototype.row = function(index){
  return this[index];
};
matrix.prototype.column = function(index){
  var col = [];

  this.traverse(function(item){col.push(item);},
  {row:{start:index, end: index + 1, increment: 1}});
  return col;
};

matrix.prototype.filter = function(fn){
  var matches = [];
  this.each(function(cell){
    if(fn(cell)) matches.push(cell);
  });
  return matches;
};



function parseOptions (opts, matLength){
  var row = {}, col = {},
      defaultOpt = {
        col:{start: 0, end: matLength, inc: 1, comp: "<"},
        row:{start: 0, inc: 1, comp: "<"} //end: in the loop for variable lengths,
      };

  //No opts? Use all defaults
  if(!opts) return defaultOpt;

  //using specific options
  else if(opts.column || opts.row){
    if(opts.column){
      //change defaults if negative increment is found
      if(opts.column.increment && opts.column.increment < 0){
        defaultOpt.col.start = matLength - 1;
        defaultOpt.col.end = 0;
      }
      col = {
        start: opts.column.start || defaultOpt.col.start,
        inc: opts.column.increment || defaultOpt.col.inc,
        comp: opts.column.comparison || null, //default set below
        end: typeof opts.column.end == "number" ? opts.column.end : null //defaults set later
      };

      //comparison is not yet set
      if(!col.comp) {
        //decrementing or incrementing
        col.comp = col.inc < 0 ? '>=' : defaultOpt.col.comp;
      }

      //end is not yet set
      if(typeof col.end !== "number"){
        //decrementing or incrementing
        col.end = col.inc < 0 ? (opts.column.end || 0) : (col.end || defaultOpt.col.end);
      }

    } else col = defaultOpt.col;


    if(opts.row) {
      //change defaults if negative increment is found
      if(opts.row.increment && opts.row.increment < 0){
        defaultOpt.row.start = null; //set in loop for variable lengths
        defaultOpt.row.end = 0;
      }
      row = {
        start: opts.row.start || defaultOpt.row.start,
        inc: opts.row.increment || defaultOpt.row.inc,
        comp: opts.row.comparison || null, //default set below
        end: typeof opts.row.end == "number" ? opts.row.end : null //default set in loop
      };

      //comparison is not yet set
      if(!row.comp) {
        //and we're decrementing
        row.comp = row.inc < 0 ? '>=' : defaultOpt.row.comp;
        if(row.inc < 0 ) row.end = opts.row.end || 0;
      }
      if(!row.end) {
        //set the default end, but still may need to be set in the loop
        row.end = defaultOpt.row.end || null;
      }
    } else row = defaultOpt.row;

    //if using generic options
  } else {
    //both will be the same
    row = col = {
      start: opts.start,
      end: opts.end,
      increment: opts.increment,
      comparison: opts.comparison
    };
    //recall this function with specific version
    return parseOptions({row: row, column: col}, matLength);
  }

  return {row:row, col:col};
}

function addRowOptions(opt, row){
  //decrementing default
  if(opt.inc < 0){
    if(typeof opt.start !== "number") opt.start = row.length - 1;
    if(typeof opt.end !== "number") opt.end = 0;
  }
  //incrementing default
  if(typeof opt.end !== "number")opt.end = row.length;
}


var loop = {
  ">": function(start, end, increment, body){
    for(var i = start; i > end; i += increment) body(i);
  },
  "<": function(start, end, increment, body){
    for(var i = start; i < end; i += increment) body(i);
  },
  ">=": function(start, end, increment, body){
    for(var i = start; i >= end; i += increment) body(i);
  },
  "<=": function(start, end, increment, body){
    for(var i = start; i <= end; i += increment) body(i);
  }
};

return matrix;
})();
