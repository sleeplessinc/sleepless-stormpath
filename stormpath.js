
var fs = require("fs");
var url = require("url");
var util = require("util");
var https = require("https");
var querystring = require("querystring");
var crypto = require("crypto");

var I = function(o) { return util.inspect(o); }

var j2o = function(j) { try { return JSON.parse(j) } catch(e) { return null } }
var o2j = function(o) { try { return JSON.stringify(o) } catch(e) { return null } }

var log5 = require("log5");
var log = log5.mkLog("Stormpath");
log(5);



var makeOpts = function(uri, opts) {
	var u = url.parse(uri);
	var o = {
		host: u.host || "api.stormpath.com",
		path: u.path || url,
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

		//log(3, "res...");
		res.setEncoding("utf8");

		res.on("data", function(d) {
			//log(3, "load data: "+d);
			json += d; 
		});

		res.on("end", function() {
			//log(3, "load end: "+json);
			var o = j2o(json);
			if(o) {
				//log(3, "parse ok");
				cb(null, o);
				return;
			}
			log(3, "parse fail");
			cb("invalid response from stormpath", null);
		});

		res.on("error", function(e) {
			log(3, "load error "+e);
			cb(e, null);
		});

	});

	if(body && typeof body === "string") {
		req.setEncoding("utf8");
		req.write(body);
	}
	req.end();
	//log(3, "load sent");
}

var get = function(path, params, cb) {
	if(params) {
		path += "?" + querystring.stringify(data);
	}
	load.call(this, makeOpts.call(this, path, { method: "GET" }), null, cb);
}

var post = function(path, job, cb) {
	var body = job ? o2j(job) : null;
	load.call(this, makeOpts.call(this, path, { method: "POST" }), body, cb);
}


var getTenant = function(path, cb) {
	get.call(this, path, null, cb);
}

var getApplications = function(key, cb) {
	get.call(this, "/v1/applications/"+key, null, cb);
}

module.exports = function(apiId, apiSecret) {
	return {
		apiId: apiId,
		apiSecret: apiSecret,
		getApplications: getApplications,
		getTenant: getTenant,
	};
};


if(require.main === module) {
	require("./test.js")
}


