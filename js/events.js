var EventLoop = function(){
	this.queue = new Queue();
	this.listeners = {};
};

EventLoop.prototype.callQueue = function(){
  while (!this.queue.isEmpty()) this.queue.dequeue()();
};

EventLoop.prototype.addListener = function(emitter, cb){
  this.listeners[emitter] = this.listeners[emitter] || [];
  this.listeners[emitter].push(cb);
  this.callQueue();
};

EventLoop.prototype.addToCallQueue = function(listenerArr){
	listenerArr.forEach(function(cb){this.queue.enqueue(cb);}.bind(this));
};

EventLoop.prototype.emit = function(emitter){
  this.addToCallQueue(this.listeners[emitter]);
  this.callQueue();
};
