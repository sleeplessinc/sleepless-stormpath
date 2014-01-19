
var fs = require("fs");
var url = require("url");
var util = require("util");
var https = require("https");
var querystring = require("querystring");
var crypto = require("crypto");

var I = function(o) { return util.inspect(o, {depth:3}); }

var j2o = function(j) { try { return JSON.parse(j) } catch(e) { return null } }
var o2j = function(o) { try { return JSON.stringify(o) } catch(e) { return null } }

var log5 = require("log5");
var log = log5.mkLog("Stormpath:");
log(5);



var makeOpts = function(uri, opts) {
	var u = url.parse(uri);
	var o = {
		host: u.host || "api.stormpath.com",
		path: u.path,
		port: 443,
		auth: this.apiId + ":" + this.apiSecret,
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
	};
	for(var k in opts) {
		o[k] = opts[k];
	}
	return o;
}


var load = function(opts, body, cb) {

	var json = "";

	var req = https.request(opts, function(res) {

		res.setEncoding("utf8");

		res.on("data", function(d) {
			// next chunk of the response has arrived
			json += d; 
		});

		res.on("end", function() {
			// reading from stormpath complete
			var err = null;
			var o = j2o(json);
			if(o) {
				// json parsed ok
				if(!o.code) {
					// no error code, all is well
					cb(null, o);
					return;
				}
				else {
					// error from stormpath
					cb( o.developerMessage, null );
				}
			}
			cb("error parsing API response", null);
		});

		res.on("error", function(e) {
			cb(e, null);
		});

	});

	if(body && typeof body === "string") {
		req.write(body);
	}
	req.end();
}

var get = function(path, params, cb) {
	if(typeof params === "function") {
		cb = params;
		params = null;
	}
	if(params) {
		path += "?" + querystring.stringify(params);
	}
	load.call(this, makeOpts.call(this, path, { method: "GET" }), null, cb);
}

var post = function(path, job, cb) {
	load.call(this, makeOpts.call(this, path, { method: "POST" }), o2j(job), cb);
}


var getApplication = function(key, cb) {
	get.call(this, "/v1/applications/"+key, null, cb);
}

var createAccount = function(app, job, cb) {
	post.call(this, app.accounts.href, job, cb);
}

var authenticateAccount = function(app, username, password, cb) {
	var sp = this;
	var job = {
		type: "basic",
		value: new Buffer(username + ":" + password).toString("base64"),
	};
	post.call(sp, app.loginAttempts.href, job, function(err, reply) {
		if(err) {
			cb(err, null);
			return;
		}
		get.call(sp, reply.account.href, null, cb); 
	});
}


module.exports = function(apiId, apiSecret, appId, cb) {
	var sp = {
		apiId: apiId,
		apiSecret: apiSecret,
		get: get,
		post: post,
		getApplication: getApplication,
		createAccount: createAccount,
		authenticateAccount: authenticateAccount,
	};

	if(appId && cb) {
		sp.getApplication(appId, cb);
	}

	return sp;
};



if(require.main === module) {
	require("./test.js")
}


