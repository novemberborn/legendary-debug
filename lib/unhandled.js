"use strict";

var EventEmitter = require("events").EventEmitter;
var legendary = require("legendary");

var emitter = module.exports = new EventEmitter();

legendary.unhandledRejection = function(reason){
  var tracked = {
    reason: reason,
    timestamp: Date.now()
  };

  emitter.emit("unhandled", tracked);

  return function(){
    if(tracked){
      tracked.handled = true;
      emitter.emit("handled", tracked);
      tracked = null;
    }
  };
};
