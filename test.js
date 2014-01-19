
var util = require("util");
var I = function(o) { return util.inspect(o, {depth:3}); }
failIf = function(c, s) { if(c) { throw new Error(s || "FAILURE"); } }


var Stormpath = require("./stormpath.js")
failIf(typeof Stormpath !== "function" );

API_ID = process.env["STORMPATH_API_ID"];
failIf(!API_ID, "please set env var STORMPATH_API_ID to continue test");

API_SECRET = process.env["STORMPATH_API_SECRET"];
failIf(!API_SECRET, "please set env var STORMPATH_API_SECRET to continue test");

APP_ID = process.env["STORMPATH_APP_ID"];
failIf(!APP_ID, "please set env var STORMPATH_APP_ID to continue test");


sp = new Stormpath(API_ID, API_SECRET);
failIf(sp.apiId !== API_ID);
failIf(sp.apiSecret !== API_SECRET);
failIf(typeof sp.get !== "function");
failIf(typeof sp.post !== "function");
failIf(typeof sp.getApplication !== "function");
failIf(typeof sp.createAccount !== "function");
failIf(typeof sp.authenticateAccount !== "function");

sp = new Stormpath( API_ID, API_SECRET, APP_ID, function(err, app) {
	failIf(err, err); 
	var username = "truff" + Math.random();
	var email = username + "@ruffnuggits.org";
	var password = "PErfidiou!99";
	sp.createAccount(app, {
		givenName: "Turlington",
		surname: "Ruffnuggitz",
		username: username,
		email: email,
		password: password,
	}, function(err, user) {
		failIf(err, err); 
		failIf(!user);
		failIf(user.status !== "ENABLED");
		failIf(user.email !== email);
		sp.authenticateAccount(app, email, password, function(err, user) {
			failIf(err, err); 
			failIf(!user);
			failIf(user.status !== "ENABLED");
			failIf(user.email !== email);
			console.log("All tests passed.");
		});
	})
});




