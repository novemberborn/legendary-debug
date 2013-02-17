"use strict";

var argv = require("optimist").argv;
var inspect = require("eyes").inspector();

exports.setup = function(config){
  config = config || {};

  if("inspectOpts" in config){
    inspect = require("eyes").inspector(config.inspectOpts);
  }else if(argv["legendary-inspect-opts"]){
    inspect = require("eyes").inspector(JSON.parse(argv["legendary-inspect-opts"]));
  }

  if("tracer" in config){
    if(config.tracer === true){
      exports.logTraces();
    }
  }else if(argv["legendary-tracer"]){
    exports.logTraces();
  }

  if("unhandled" in config){
    if(config.unhandled === true || typeof config.unhandled === "number"){
      exports.logUnhandled(config.unhandled === true ? 1000 : config.unhandled);
    }
  }else if("legendary-unhandled" in argv){
    exports.logUnhandled(typeof argv["legendary-unhandled"] === "number" ? argv["legendary-unhandled"] : 1000);
  }
};

exports.enableTracer = function(){
  return require("./lib/tracer");
};

exports.logTraces = function(){
  var tracer = exports.enableTracer();
  ["fulfilled", "rejected"].forEach(function(type){
    tracer.on(type, function(value, label, meta){
      if(label){
        label += " (" + type + ")";
      }else{
        label = type;
      }

      inspect(value, label);
      if(typeof meta !== "undefined"){
        inspect(meta, label + " (meta)");
      }
    });
  });
};

exports.catchUnhandled = function(){
  return require("./lib/unhandled");
};

exports.logUnhandled = function(delay){
  if(!delay){
    exports.catchUnhandled().on("unhandled", function(tracked){
      inspect(tracked.reason, "unhandled rejection");
    });
  }else{
    exports.catchUnhandled().on("unhandled", function(tracked){
      setTimeout(function(){
        if(!tracked.handled){
          inspect(tracked.reason, "unhandled rejection @ " + new Date(tracked.timestamp).toISOString());
        }
      }, delay);
    });
  }
};
