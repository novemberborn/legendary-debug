"use strict";

require("../").logTraces();

var legendary = require("legendary");

legendary.fulfilled(42).trace("already fulfilled", { foo: "bar" });

legendary.rejected(new Error()).traceRejected();
