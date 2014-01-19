
failIf = function(c, s) { if(c) { throw new Error(s || "TEST FAILED"); } }


var Stormpath = require("./stormpath.js")
failIf(typeof Stormpath !== "function" );

sp = new Stormpath("FAKE_API_KEY", "FAKE_API_SECRET");
failIf(sp.apiKey !== "FAKE_API_KEY");
failIf(sp.apiSecret !== "FAKE_API_SECRET");
failIf(typeof sp.getTenants !== "function");


console.log("All tests passed OK")



