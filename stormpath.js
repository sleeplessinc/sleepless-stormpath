
var fs = require("fs");
var url = require("url");
var util = require("util");
var https = require("https");
var qstr = require("qstr");
var crypto = require("crypto");

var I = function(o) { return util.inspect(o); }

var j2o = function(j) { try { return JSON.parse(j) } catch(e) { return null } }
var o2j = function(o) { try { return JSON.stringify(o) } catch(e) { return null } }

var log5 = require("log5");
var log = log5.mkLog("Stormpath");
log(5);



var makeOpts = function(opts) {
	var o = {
		host: "api.stormpath.com",
		path: "/",
		port: 443,
		method: method,
		auth: SP.apiId + ":" + SP.apiSecret,
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


var load = function(opts, path, body, cb) {

	opts.path = path;

	var json = "";

	var req = https.request(opts, function(res) {
		res.setEncoding("utf8");
		res.on("data", function(d) {
			log("load data: "+d);
			json += d; 
		});
	});

	req.on("end", function() {
		log(3, "load end");
		var o = j2o(json);
		if(o) {
			log(3, "parse ok");
			cb(null, o);
			return;
		}
		log(3, "parse fail");
		cb("invalid response from stormpath", null);
	});

	req.on("error", function(e) {
		log(3, "load error "+e);
		cb(e, null);
	});

	if(body && typeof body === "string") {
		req.setEncoding("utf8");
		req.write(body);
	}
	req.end();
	log(3, "load sent");
}

var get = function(path, params, cb) {
	if(params) {
		path += "?" + qstr.stringify(data);
	}
	load(makeOpts({ method: "GET" }), path, null, cb);
}

var post = function(path, job, cb) {
	var body = job ? o2j(job) : null;
	load(makeOpts({ method: "POST" }), path, body, cb);
}


var getTenants = function(cb) {
	get("/v1/tenants/current", null, function(reply) {
		log(3, "get reply="+I(reply));
	})
}


module.exports = function(apiId, apiSecret) {
	return {
		apiId: apiId,
		apiSecret: apiSecret,
		getTenants: getTenants,
	};
};


if(require.main === module) {
	require("../test/test.js")
}


