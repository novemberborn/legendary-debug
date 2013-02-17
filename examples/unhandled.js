"use strict";

require("../").logUnhandled(1000);

var legendary = require("legendary");

// A handled rejection
legendary.Promise(function(resolve, reject){
  reject(new Error("should've been handled"));
}).then(null, function(){});

// An unhandled rejection
legendary.Promise(function(resolve, reject){
  reject(new Error("unhandled"));
});
