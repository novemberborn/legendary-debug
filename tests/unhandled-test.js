"use strict";

var assert = require("assert");
var sinon = require("sinon");

var adapter = global.adapter;
var pending = adapter.pending;
var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;

var legendary = require("legendary");
var catchUnhandled = require("../").catchUnhandled;

var sentinel = {};

describe("All rejections start as unhandled", function(){
  var unhandledRejection = legendary.unhandledRejection;
  var spy;

  beforeEach(function(){
    spy = sinon.spy(legendary, "unhandledRejection");
  });

  afterEach(function(){
    legendary.unhandledRejection = unhandledRejection;
  });

  specify("Reject explicitly", function(){
    pending().reject(sentinel);

    assert(spy.calledOnce);
    assert(spy.calledWithExactly(sentinel));
  });

  specify("rejected()", function(){
    rejected(sentinel);

    assert(spy.calledOnce);
    assert(spy.calledWithExactly(sentinel));
  });

  specify("onFulfilled throws", function(done){
    var promise = fulfilled();
    promise.then(function(){
      throw sentinel;
    });

    promise.then(function(){
      assert(spy.calledOnce);
      assert(spy.calledWithExactly(sentinel));
      done();
    });
  });
});

describe("Rejections are handled eventually", function(){
  var unhandledRejection = legendary.unhandledRejection;
  var spy;

  before(function(){
    spy = sinon.spy();
    catchUnhandled().on("handled", spy);
  });

  after(function(){
    legendary.unhandledRejection = unhandledRejection;
  });

  afterEach(function(){
    spy.reset();
  });

  specify("Handling immediately", function(done){
    rejected(sentinel).then(null, function(){
      assert(spy.calledOnce);
      assert(spy.calledWithMatch({ reason: sentinel }));
      done();
    });
  });

  specify("Handling later", function(done){
    var promise = rejected(sentinel);
    setTimeout(function(){
      promise.then(null, function(){
        assert(spy.calledOnce);
        assert(spy.calledWithMatch({ reason: sentinel }));
        done();
      });
    }, 50);
  });
});
