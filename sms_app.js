var my_express = require("./my_express");
var express = my_express();
var url = require('url');
var sha1 = require('sha1');
var qs = require('querystring');
var crypto = require('crypto');
var sqlite3 = require('sqlite3').verbose();
var StaticServer = require('node-static').Server;
var file = new StaticServer('./public');
var sessions = {};
var mySessionId = "";

var createSession = function(username) {
	const buffer = crypto.randomBytes(4);
	return sha1(Date.now() + username + buffer.toString('hex'));
};

var isExisting = function(sessionId) {
	if(sessionId && sessions[sessionId]) {
		return true;
	}
	else {
		return false;
	}
};

express.get("/", function(req, res) {
	file.serveFile("/login.html", 200 , {}, req, res);
});

express.get("/login.js", function(req, res) {
	file.serveFile("/login.js", 200, {}, req, res);
});

express.get("/common_layout.css", function(req, res) {
	file.serveFile("/common_layout.css", 200, {}, req, res);
});

express.get("/home_layout.css", function(req, res) {
	file.serveFile("/home_layout.css", 200, {}, req, res);
});

express.get("/images/miPie.png", function(req, res) {
	file.serveFile("/images/miPie.png", 200, {}, req, res);
}) ;

express.post("/login", function(req, res) {
	var data = "";
	req.on('data', function(dd) {
		data += dd.toString();
	});
	req.on('end', function() {
		res.writeHead(200, {"Content-Type" : "text/plain"});
		var profile = JSON.parse(data);
		var pass = sha1(profile.username + profile.password);
		var dbStuds = new sqlite3.Database('loginUser.db');
		var query = "SELECT * FROM user_info WHERE username = " + "'" + profile.username + "'";
		dbStuds.serialize(function() {
			dbStuds.all(query, function(err, row) {
				if(err) throw err;
				if(row.length == 0) {
						res.end("error");
				}
				else if(row.length != 0){
					if(row[0].password == pass) {		
						var sessionId = createSession(profile.username);
						sessions[sessionId] = profile.username;
						status = {
							"token" : sessionId
						}
						res.end(JSON.stringify(status), 200,'application/json');
					}
					else {
						res.end("error");
					}
				}
			});
		});
	});
});

express.get('/user', function(req, res) {
    res.send(200, 'text/plain', mySessionId);
});

express.get("/index", function(req, res) {
	var parsedUrl = qs.parse(req.path.query);
	mySessionId = parsedUrl.token;
	if(isExisting(mySessionId)) {
		file.serveFile("/index.html", 200, {}, req, res);
	}
	else {
		res.writeHead(404, {"Content-Type" : "text/html"});
		res.write('<p><h2>You are not yet granted access!</h2></p>');
		res.end('<p>Proceed to the <a href="/">Login Page</p>');
	}
});

express.listen(1501);