"use strict";

var EventEmitter = require("events").EventEmitter;
var Promise = require("legendary").Promise;

var emitter = module.exports = new EventEmitter();

Promise.prototype.trace = function(label, meta){
  this.then(traceFulfilled(label, meta), traceRejected(label, meta));
  return this;
};

Promise.prototype.traceFulfilled = function(label, meta){
  this.then(traceFulfilled(label, meta));
  return this;
};

Promise.prototype.traceRejected = function(label, meta){
  this.then(null, traceRejected(label, meta));
  return this;
};

function traceFulfilled(label, meta){
  return function(value){
    emitter.emit("fulfilled", value, label, meta);
  };
}

function traceRejected(label, meta){
  return function(reason){
    emitter.emit("rejected", reason, label, meta);
  };
}
