var EventListener = function(){
	this.queue = new Queue();
	this.events = {};
};

EventListener.prototype.callQueue = function(){
  while (!this.queue.isEmpty()) this.queue.dequeue()();
};

EventListener.prototype.on = function(event, handler, context){
  this.events[event] = this.events[event] || [];
  context = context || null;
  this.events[event].push({fn:handler, context:context});
  this.callQueue();
};

EventListener.prototype.addToCallQueue = function(listenerArr, emitterArgs){
	listenerArr.forEach(function(handler){
    this.queue.enqueue(function(){ handler.fn.apply(handler.context, emitterArgs);});
  }.bind(this));
};

EventListener.prototype.emit = function(event, args){
  if(this.events[event]) this.addToCallQueue(this.events[event], args);
  this.callQueue();
};

var events = new EventListener();
