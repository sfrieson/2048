var Queue = (function(){
  var dataStore = [];
  var Q = function(){ };//to make it a constructor
  Q.prototype.enqueue =   function(value){    dataStore.push(value); return dataStore[dataStore.length - 1];};
  Q.prototype.dequeue =   function(){         return dataStore.shift();};
  Q.prototype.peek =      function(){         return dataStore[0];};
  Q.prototype.isEmpty =   function(){         return dataStore.length > 0 ? false : true;};
  return Q;
})();
