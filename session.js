var redis = require('redis');
var client = redis.createClient();
var crypto = require('crypto');
var StaticServer = require('node-static').Server;
var file = new StaticServer('./public');
var fs = require("fs");

exports.startSession = function(name, callback) {
	var id = crypto.randomBytes(16).toString('hex');
	client.set(id, name, function () {
		callback(id)
	});
}

exports.endSession = function(sessionid, callback) {
	client.del(sessionid, function (err, reply) {
		callback()
	});
}

function getUser(sessionid, callback) {
	client.get(sessionid, function (err, reply) {
		callback(reply)
	});
}

function errorSession(res) {
	res.writeHead(404, { "Content-Type": "text/html" });
	res.write('<p><h2>You are not yet granted access!</h2></p>');
	res.end('<p>Proceed to the <a href="/">Login Page</p>');
}

function notAuthorized(res) {
	res.writeHead(401, { "Content-Type": "text/html" });
	res.write('<p><h2>You do not have enough clearance to access this page!</h2></p>');
	res.end('<p>Proceed to <a href="/index">Home Page</p>');
}

exports.doesSessionExist = function(req, res, url, string, sessionId, account) {
	client.exists(sessionId, function (err, reply) {
		if (reply == 1 && sessionId != undefined) {
			getUser(sessionId, function(name) {
				if(name != null) {
					var datetime = new Date(Date.now()).toLocaleString();
					var str = datetime + " " + name + ":" + sessionId + " " + string + "\n";
					fs.writeFile('log.txt', str,  {'flag':'a'},  function(err) {
						if(err) throw err;
					});
					accountChecking(url, account, function(checked) {
						if(checked === "true") {
							file.serveFile("/" + string, 200, {}, req, res);
						}
						else {
							notAuthorized(res);
						}
					});
				}
				else {
					notAuthorized(res);
				}
			});
		} 
		else {
			errorSession(res);
		}
	});
}

// 
// Think of a better implementation of this
// 
function accountChecking(url, account, callback) {
	var checked = "true";
	if((account === "teacher") && (url.includes("accounting")) || (account === "teacher") && (url.includes("lcpa"))) {
		checked = "false";
	}
	else if((account === "guest") && (url.includes("accounting")) || (account === "guest") && (url.includes("grading")) || (account === "guest") && (url.includes("performing-arts"))) {
		checked = "false";
	}
	else if((account === "registrar") && (url.includes("fees"))) {
		checked = "false";
	}
	else if((account === "game") && (!url.includes("academic-challenge"))) {
		checked = "false";
	}
	callback(checked);
}
