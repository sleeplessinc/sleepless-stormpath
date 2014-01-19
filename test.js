
failIf = function(c, s) { if(c) { throw new Error(s || "TEST FAILED"); } }


var Stormpath = require("./stormpath.js")
failIf(typeof Stormpath !== "function" );

sp = new Stormpath("FAKE_API_KEY", "FAKE_API_SECRET");
failIf(sp.apiId !== "FAKE_API_KEY");
failIf(sp.apiSecret !== "FAKE_API_SECRET");
failIf(typeof sp.get !== "function");
failIf(typeof sp.post !== "function");
failIf(typeof sp.getApplication !== "function");
failIf(typeof sp.createAccount !== "function");
failIf(typeof sp.authenticateAccount !== "function");

sp = new Stormpath("FAKE_API_KEY", "FAKE_API_SECRET", "FAKE_APP_ID", function(err, app) {
	failIf(err !== "Authentication with a valid API Key is required." );
});


//console.log("\nAll tests passed okay!\n")



