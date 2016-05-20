if(!Array.isArray) Array.isArray = a => Object.prototype.toString.call(a) === "[object Array]";
var diff = (function (){
  var diff = function (a, b, opt) {
    console.log("diff");
    var primitiveRegEx = /string|number|boolean|undefined|symbol/i; //excluding null

    var results = false;
    // Add on missing options
    var options = ['undefined'];
    opt = addOptions(opt, options, false);

    //If missing an argument and not using the option to allow for undefined variables
    if ((a === undefined || b === undefined) && !opt['undefined']) throw new TypeError("You must supply two arguments to diff.");

    // Primitive equality (excluding null) or same reference
    if (a === b) return results;

    //Same Types
    if(typeof a === typeof b){
      if(primitiveRegEx.test(typeof a)) results = primDiff(a,b,opt);
      else if(a === null || b === null) results = b; // same as Different Types else
      else if(typeof a === "function")  results = fnDiff(a,b,opt);
      else if(Array.isArray(a))         results = arrDiff(a,b,opt);
      else                              results = objDiff(a,b,opt);

    //Different Types
    } else results = b;

    return results;
  };

  function primDiff (a, b, opt){
    console.log('primDiff');
    var options = ["difference"];
    opt = addOptions(opt, options, false);
    if(opt.difference && /number/.test(typeof a)) return b-a;
    //TODO: Add string diffing

    return b;
  }

  function arrDiff (a, b, opt){
    console.log('arrDiff');
    var options = ["variableSizeArr", "fixedSizeArr"];
    opt = addOptions(opt, options, false);
    //variable size as default;
    if(!opt.variableSizeArr && !opt.fixedSizeArr) opt.variableSizeArr = true;
    var response;
    if(opt.variableSizeArr) response = variableSizeArrDiff(a,b,opt);
    if(opt.fixedSizeArr) response = fixedSizeArrDiff(a,b,opt);

    if(response.diffFound) return response.results;
    return false;
  }

  var variableSizeArrDiff = function(a,b,opt) {
    console.log("variableSizeArrDiff");
    var results = {added:[], removed:[] };
    var diffFound = false;

    a.forEach(function(item, i){
      var bIndex;
      //If item from a is found on b, remove it from b
      if((bIndex = b.indexOf(item)) > -1) b.splice(bIndex, 1);

      //Otherwise, add it to the removed array
      else {
        results.removed.push(item);
        diffFound = true;
      }
    });

    //if there are still indexes on b, those become the added array
    if(b.length){
      results.added = b;
      diffFound = true;
    }

    return {results: results, diffFound: diffFound};
  };
  var fixedSizeArrDiff = function(a,b,opt) {
    console.log("fixedSizeArrDiff");
    var results = {added:[], removed:[], changed:[] };
    var diffFound = false;

    a.forEach(function(item, i){
      //Equivalent in absence or presence
      if(item === b[i]) return;

      //One doesn't exist
      if(!item || !b[i]){
        !item ? results.added.push(b[i]) : results.removed.push(item);
        diffFound = true;
      }
      //both are present and seem different
      else {
        var diffResult;
        if ((diffResult = diff(a[i],b[i], opt))){
          results.changed.push(diffResult);
          diffFound = true;
        }
      }

    });

    return {results: results, diffFound: diffFound};
  };


  function fnDiff (a, b, opt){
    console.log('fnDiff');
    if ( a.toString() === b.toString() ) return false;
    //TODO: Think through other possible helpful implementations
    return b;
  }
  function objDiff (a, b, opt){
    console.log('objDiff');
    var options = ["difference"];
    opt = addOptions(opt, options, false);
    var diffFound = false;
    var results = {
      added:[],
      removed:[],
      changed: {}
    };

    //container for all properties on both.
    var properties = keys(a,b);
    properties.forEach(function(p) {
      //If they both have the property find if there are differences between them
      if(a.hasOwnProperty(p) && b.hasOwnProperty(p)) {
        var result = diff( a[p], b[p], opt);
        if (result) {
          results.changed[p] = result;
          diffFound = true;
        }
      }
      //Otherwise, record which were added and which were removed
      else {
        a.hasOwnProperty(p) ? results.removed.push(p) : results.added.push(p);
        diffFound = true;
      }
    });
    if (diffFound)return results;
    return false;
  }

  // Utilities
  function addOptions (object, optArr, defaultValue){
    console.log('addOptions');
    object = object || {};
    optArr.forEach(function(option){ object[option] = object[option] || defaultValue; });
    return object;
  }

  function keys (){
    console.log('keys');
    var keys = [];
    //To avoid duplicates without having to use indexOf
    var found = {};

    for(var i = 0; i < arguments.length; i++){
      for(var prop in arguments[i]) {
        if(arguments[i].hasOwnProperty(prop) && !found[prop]) {
          keys.push(prop);
          found[prop] = true;
        }
      }
    }
    return keys;
  }
  return diff;
})();
