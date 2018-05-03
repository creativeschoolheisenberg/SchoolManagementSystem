var my_express = require("./my_express");
var session = require("./session");
var connectdb = require("./connectdb");
var express = my_express();
var url = require('url');
var sha1 = require('sha1');
var qs = require('querystring');
var sqlite3 = require('sqlite3').verbose();
var StaticServer = require('node-static').Server;
var file = new StaticServer('./public');
var fs = require("fs");
var sessionId;
var account;
var sessions = {};

// session.doesSessionExist(req, res, "/login.js", "login.js", sessionId, account);

express.get("/", function (req, res) {
	file.serveFile("/login.html", 200, {}, req, res);
})

express.get("/signup", function (req, res) {
	file.serveFile("signup.html", 200, {}, req, res);
})

express.get("/common_layout.css", function (req, res) {
	file.serveFile("/common_layout.css", 200, {}, req, res);
})

express.get("/login-layout.css", function (req, res) {
	file.serveFile("/login-layout.css", 200, {}, req, res);
})

express.get("/home_layout.css", function (req, res) {
	file.serveFile("/home_layout.css", 200, {}, req, res);
})

express.get("/table-sidebar-layout.css", function (req, res) {
	file.serveFile("/table-sidebar-layout.css", 200, {}, req, res);
})

express.get("/button-layout.css", function (req, res) {
	file.serveFile("/button-layout.css", 200, {}, req, res);
})

express.get("/images/miPie.png", function (req, res) {
	file.serveFile("/images/miPie.png", 200, {}, req, res);
})

express.get("/images/blank-photo.png", function (req, res) {
	file.serveFile("/images/blank-photo.png", 200, {}, req, res);
})

express.get("/images/add.png", function (req, res) {
	file.serveFile("/images/add.png", 200, {}, req, res);
})

express.get("/accounting_layout.css", function (req, res) {
	file.serveFile("/accounting_layout.css", 200, {}, req, res);
})

express.get("/accounting/accounting_layout.css", function (req, res) {
	file.serveFile("/accounting_layout.css", 200, {}, req, res);
})

express.get("/accounting/home_layout.css", function (req, res) {
	file.serveFile("/home_layout.css", 200, {}, req, res);
})

express.get("/admission/table-sidebar-layout.css", function (req, res) {
	file.serveFile("/table-sidebar-layout.css", 200, {}, req, res);
})

express.get("/admission/button-layout.css", function (req, res) {
	file.serveFile("/button-layout.css", 200, {}, req, res);
})

express.get("/admission/common_layout.css", function (req, res) {
	file.serveFile("/common_layout.css", 200, {}, req, res);
})

express.get("/accounting/table-sidebar-layout.css", function (req, res) {
	file.serveFile("/table-sidebar-layout.css", 200, {}, req, res);
})

express.get("/accounting/button-layout.css", function (req, res) {
	file.serveFile("/button-layout.css", 200, {}, req, res);
})

express.get("/accounting/common_layout.css", function (req, res) {
	file.serveFile("/common_layout.css", 200, {}, req, res);
})

express.get("/performing-arts/common_layout.css", function (req, res) {
	file.serveFile("/common_layout.css", 200, {}, req, res);
})

express.get("/performing-arts/table-sidebar-layout.css", function (req, res) {
	file.serveFile("/table-sidebar-layout.css", 200, {}, req, res);
})

express.get("/performing-arts/button-layout.css", function (req, res) {
	file.serveFile("/button-layout.css", 200, {}, req, res);
})

express.get("/login.js", function (req, res) {
	file.serveFile("/login.js", 200, {}, req, res);
})

express.get("/logout.js", function(req, res) {
	file.serveFile("/logout.js", 200, {}, req, res);
})

express.get("/admission/admission.js", function (req, res) {
	file.serveFile("admission.js", 200, {}, req, res);
})

express.get("/admission/creative-admission.js", function (req, res) {
	file.serveFile("creative-admission.js", 200, {}, req, res);
})

express.get("/admission/takephoto.js", function (req, res) {
	file.serveFile("takephoto.js", 200, {}, req, res);
})

express.get("/admission/logout.js", function (req, res) {
	file.serveFile("logout.js", 200, {}, req, res);
})

express.get("/admission/lcpa-admission.js", function (req, res) {
	file.serveFile("lcpa-admission.js", 200, {}, req, res);
})

express.get("/admission/pre-nursery-admission.js", function (req, res) {
	file.serveFile("pre-nursery-admission.js", 200, {}, req, res);
})

express.get("/profile", function (req, res) {
	file.serveFile("profile.html", 200, {}, req, res);
})

express.get("/profile/creative-student-profile", function (req, res) {
	file.serveFile("creative-student-profile.html", 200, {}, req, res);
})

express.get("/profile/pre-nursery-profile", function (req, res) {
	file.serveFile("pre-nursery-profile.html", 200, {}, req, res);
})

express.get("/profile/table-sidebar-layout.css", function (req, res) {
	file.serveFile("/table-sidebar-layout.css", 200, {}, req, res);
})

express.get("/profile/button-layout.css", function (req, res) {
	file.serveFile("/button-layout.css", 200, {}, req, res);
})

express.get("/profile/common_layout.css", function (req, res) {
	file.serveFile("/common_layout.css", 200, {}, req, res);
})

express.get("/profile/creative-student-profile.js", function (req, res) {
	file.serveFile("creative-student-profile.js", 200, {}, req, res);
})

express.get("/profile/admission.js", function (req, res) {
	file.serveFile("admission.js", 200, {}, req, res);
})

express.get("/profile/logout.js", function (req, res) {
	file.serveFile("logout.js", 200, {}, req, res);
})

express.get("/profile/takephoto.js", function (req, res) {
	file.serveFile("takephoto.js", 200, {}, req, res);
})

express.get("/performing-arts/logout.js", function (req, res) {
	file.serveFile("logout.js", 200, {}, req, res);
})

express.get("/accounting/admission.js", function (req, res) {
	session.doesSessionExist(req, res, "/accounting/admission.js", "admission.js", sessionId, account);
})

express.get("/accounting/fees.js", function (req, res) {
	session.doesSessionExist(req, res, "/accounting/fees.js", "fees.js", sessionId, account);
})

express.get("/accounting/enrolment.js", function (req, res) {
	session.doesSessionExist(req, res, "/accounting/enrolment.js", "enrolment.js", sessionId, account);
})

express.get("/accounting/discounts.js", function (req, res) {
	session.doesSessionExist(req, res, "/accounting/discounts.js", "discounts.js", sessionId, account);
})

express.get("/accounting/logout.js", function (req, res) {
	file.serveFile("logout.js", 200, {}, req, res);
})

express.post("/checkUser", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var profile = JSON.parse(data);
		connectdb.checkUser(profile, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		});
	});
})

express.post("/login", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var profile = JSON.parse(data);
		connectdb.login(profile, function(status) {
			sessionId = status.token;
			account = status.account;
			sessions[profile.username] = status.token;
			res.end(JSON.stringify(status), 200, 'application/json');
		});
	});
})

express.post("/logout", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var profile = JSON.parse(data);
		session.endSession(profile.mySession, function () {
			console.log("Session ended: " + profile.mySession);
			var status = {
				"message" : "YES"
			};
			res.end(JSON.stringify(status), 200, 'application/json');
		});
	});
})

express.get("/thankyou", function (req, res) {
	file.serveFile("/thankyou.html", 200, {}, req, res);
})

express.post("/signup", function(req, res) {
	var data = "";
	req.on('data', function(dd) {
		data += dd.toString();
	});
	req.on('end', function() {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var user = JSON.parse(data);
		connectdb.signup(user, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		})
	});
})

express.post("/checkStudentNumber", function(req, res) {
	var data = "";
	req.on('data', function(dd) {
		data += dd.toString();
	});
	req.on('end', function() {
		res.writeHead(200, { "Content-Type" : "text/plain" });
		var qs = JSON.parse(data);
		connectdb.checkStudentNumber(qs.studentNumber, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		});
	});
})

express.post("/addPre-Nursery", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var qs = JSON.parse(data);
		connectdb.addPreNurseryStudent(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		});
	});
})

express.post("/addCreativeStudent", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var qs = JSON.parse(data);
		connectdb.addCreativeStudent(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		})
	});
})

express.put("/updateCreativeStudent", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var qs = JSON.parse(data);
		connectdb.updateCreativeStudent(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		})
	});
})

express.post("/addLCPAStudent", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var qs = JSON.parse(data);
		connectdb.addLCPAStudent(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		});
	});
})

express.post("/importPreNurseryInformation", function(req, res) {
	var data = "";
	req.on('data', function(dd) {
		data += dd.toString();
	})
	req.on('end', function() {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var qs = JSON.parse(data);
		connectdb.fetchPreNurseryInformation(qs, function(preNurseryData) {
			res.end(JSON.stringify(preNurseryData), 200, 'application/json');
		})
	})
})

// express.post("/addPhoto", function (req, res) {
// 	var data = "";
// 	req.on('data', function (dd) {
// 		data += dd.toString();
// 	});
// 	req.on('end', function () {
// 		res.writeHead(200, { "Content-Type": "text/plain" });
// 		var qs = JSON.parse(data);
// 		var dbStuds = new sqlite3.Database('CreativeStudents.db');
// 		dbStuds.serialize(function () {
// 			//FOR STUDENT RECORD
// 			dbStuds.run("CREATE TABLE if not exists student_img (StudentNumber int primary key, filename text, imagedata blob)");
// 			var studIns = dbStuds.prepare("INSERT INTO student_img VALUES (?, ?, ?)");
// 			studIns.run(qs.studentNumber, qs.filename, qs.base64);
// 			studIns.finalize();
// 		});
// 		dbStuds.close();
// 		res.end(`Thank YOU: ${JSON.stringify(qs)}`);
// 	});
// })

express.post("/enrolCreativeStudent", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		var qs = JSON.parse(data);
		connectdb.enrolCreativeStudent(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		});
	});
})

express.post("/enrolLCPAStudent", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		var qs = JSON.parse(data);
		connectdb.enrolLCPAStudent(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		});
	});
})

express.post("/searchStudent", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		var qs = JSON.parse(data);
		connectdb.searchStudent(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		});
	});
})

express.post("/searchPreNursery", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		var qs = JSON.parse(data);
		connectdb.searchPreNursery(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		});
	});
})

express.post("/searchLCPAStudent", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		var qs = JSON.parse(data);
		connectdb.searchLCPAStudent(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		});
	});
})

// express.post("/showStudent", function (req, res) {
// 	console.log("SEARCHSTUDENT");
// 	var data = "";
// 	req.on('data', function (dd) {
// 		data += dd.toString();
// 	});
// 	req.on('end', function () {
// 		var qs = JSON.parse(data);
// 		var dbStuds = new sqlite3.Database('CreativeStudents.db');
// 		dbStuds.serialize(function () {
// 			dbStuds.each("SELECT * FROM student_img WHERE StudentNumber = " + qs.searchStudNumber, function (err, row) {
// 				if (err) throw err;
// 				var status = {
// 					"filename": row.filename,
// 					"image": row.imagedata
// 				}
// 				res.end(JSON.stringify(status), 200, 'application/json');
// 			});
// 		});
// 		dbStuds.close();
// 	});
// })

express.post("/showFees", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		var qs = JSON.parse(data);
		connectdb.showFees(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		});
	});
})

express.post("/showLCPAFees", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		var qs = JSON.parse(data);
		connectdb.showLCPAFees(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		});
	});
})

express.post("/updateFees", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var qs = JSON.parse(data);
		connectdb.saveFees(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		})
	});
})

express.put("/updateFees", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var qs = JSON.parse(data);
		connectdb.updateFees(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		})
	});
})

express.post("/updateLCPAFees", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var qs = JSON.parse(data);
		connectdb.saveLCPAFees(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		})
	});
})

express.put("/updateLCPAFees", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var qs = JSON.parse(data);
		connectdb.updateLCPAFees(qs, function(status) {
			res.end(JSON.stringify(status), 200, 'application/json');
		})
	});
})

// express.get('/user', function (req, res) {
// 	res.send(200, 'text/plain', mySessionId);
// })

express.get("/index", function (req, res) {
	session.doesSessionExist(req, res, "/index", "index.html", sessionId, account);
})

express.get("/home", function (req, res) {
	session.doesSessionExist(req, res, "/home", "index.html", sessionId, account);
})

express.get("/accounting", function (req, res) {
	session.doesSessionExist(req, res, "/accounting", "accounting.html", sessionId, account);
})

express.get("/admission", function (req, res) {
	session.doesSessionExist(req, res, "/admission", "admission.html", sessionId, account);
})

express.get("/admission/pre-nursery-admission", function (req, res) {
	session.doesSessionExist(req, res, "/admission/pre-nursery-admission", "pre-nursery-admission.html", sessionId, account);
})

express.get("/admission/creative-admission", function (req, res) {
	session.doesSessionExist(req, res, "/admission/creative-admission", "creative-admission.html", sessionId, account);
})

express.get("/admission/lcpa-admission", function (req, res) {
	session.doesSessionExist(req, res, "/admission/lcpa-admission", "lcpa-admission.html", sessionId, account);
})

express.get("/admission/tutorials", function (req, res) {
	session.doesSessionExist(req, res, "/admission/tutorials", "tutorials.html", sessionId, account);
})

express.get("/grading", function (req, res) {
	session.doesSessionExist(req, res, "/grading", "grading.html", sessionId, account);
})

express.get("/performing-arts", function (req, res) {
	session.doesSessionExist(req, res, "/performing-arts", "lcpa.html", sessionId, account);
})

express.get("/performing-arts/lcpa-enrolment", function (req, res) {
	session.doesSessionExist(req, res, "/performing-arts/lcpa-enrolment", "lcpa-enrolment.html", sessionId, account);
})

express.get("/performing-arts/lcpa-payment", function (req, res) {
	session.doesSessionExist(req, res, "/performing-arts/lcpapayment", "lcpa-payment.html", sessionId, account);
})

express.get("/performing-arts/lcpa-enroled-students", function (req, res) {
	session.doesSessionExist(req, res, "/performing-arts/lcpa-enroled-students", "lcpa-enroled-students.html", sessionId, account);
})

express.get("/performing-arts/lcpa-notice", function (req, res) {
	session.doesSessionExist(req, res, "/performing-arts/lcpa-notice", "lcpa-notice.html", sessionId, account);
})

express.get("/performing-arts/lcpa-fees", function (req, res) {
	session.doesSessionExist(req, res, "/performing-arts/lcpa-fees", "lcpa-fees.html", sessionId, account);
})

express.get("/performing-arts/lcpa-fees.js", function (req, res) {
	session.doesSessionExist(req, res, "/performing-arts/lcpa-fees.js", "lcpa-fees.js", sessionId, account);
})

express.get("/performing-arts/lcpa-enrolment.js", function (req, res) {
	session.doesSessionExist(req, res, "/performing-arts/lcpa-enrolment.js", "lcpa-enrolment.js", sessionId, account);
})

express.get("/accounting/registration", function (req, res) {
	session.doesSessionExist(req, res, "/accounting/registration", "registration.html", sessionId, account);
})

express.get("/accounting/enrolment", function (req, res) {
	session.doesSessionExist(req, res, "/accounting/enrolment", "enrolment.html", sessionId, account);
})

express.get("/accounting/payment", function (req, res) {
	session.doesSessionExist(req, res, "/accounting/payment", "payment.html", sessionId, account);
})

express.get("/accounting/enroled-students", function (req, res) {
	session.doesSessionExist(req, res, "/accounting/enroled-students", "enroled-students.html", sessionId, account);
})

express.get("/accounting/notice", function (req, res) {
	session.doesSessionExist(req, res, "/accounting/notice", "notice.html", sessionId, account);
})

express.get("/accounting/fees", function (req, res) {
	session.doesSessionExist(req, res, "/accounting/fees", "fees.html", sessionId, account);
})

// For Academic Challenge
express.get("/academic-challenge", function(req, res) {
	session.doesSessionExist(req, res, "/academic-challenge", "academic-challenge.html", sessionId, account);
})

express.get("/academic-challenge.js", function(req, res) {
	file.serveFile("/academic-challenge.js", 200, {}, req, res);
})

express.get("/academic-challenge-questions", function(req, res) {
	session.doesSessionExist(req, res, "/academic-challenge-questions", "academic-challenge-questions.html", sessionId, account);
})

express.get("/academic-challenge-questions.js", function(req, res) {
	file.serveFile("/academic-challenge-questions.js", 200, {}, req, res);
})

express.get("/sound/Buzzer.mp3", function(req, res) {
	file.serveFile("/sound/Buzzer.mp3", 200, {}, req, res);
})

express.get("/sound/Buzzer.wav", function(req, res) {
	file.serveFile("/sound/Buzzer.wav", 200, {}, req, res);
})

express.get("/images/MATH.jpg", function(req, res) {
	file.serveFile("/images/MATH.jpg", 200, {}, req, res);
})

express.get("/images/SCIENCE.jpg", function(req, res) {
	file.serveFile("/images/SCIENCE.jpg", 200, {}, req, res);
})

express.get("/images/SIBIKA.jpg", function(req, res) {
	file.serveFile("/images/SIBIKA.jpg", 200, {}, req, res);
})

express.get("/images/SPELLING.jpg", function(req, res) {
	file.serveFile("/images/SPELLING.jpg", 200, {}, req, res);
})

express.get("/images/Grade1.jpg", function(req, res) {
	file.serveFile("/images/Grade1.jpg", 200, {}, req, res);
})

express.get("/images/Grade2.jpg", function(req, res) {
	file.serveFile("/images/Grade2.jpg", 200, {}, req, res);
})

express.get("/images/Grade3.jpg", function(req, res) {
	file.serveFile("/images/Grade3.jpg", 200, {}, req, res);
})

express.get("/images/Grade4.jpg", function(req, res) {
	file.serveFile("/images/Grade4.jpg", 200, {}, req, res);
})

express.get("/images/Grade5.jpg", function(req, res) {
	file.serveFile("/images/Grade5.jpg", 200, {}, req, res);
})

express.get("/images/Grade6.jpg", function(req, res) {
	file.serveFile("/images/Grade6.jpg", 200, {}, req, res);
})

// Qusetions for Academic Challenge
express.get("/questions.json", function (req, res) {
	file.serveFile("/json/questions.json", 200, {}, req, res);
})

express.get("/images/clock.jpg", function (req, res) {
	file.serveFile("/images/clock.jpg", 200, {}, req, res);
})

express.get("/images/triangle.jpg", function (req, res) {
	file.serveFile("/images/triangle.jpg", 200, {}, req, res);
})

express.post("/questions.json", function (req, res) {
	var data = "";
	req.on('data', function (dd) {
		data += dd.toString();
	});
	req.on('end', function () {
		res.writeHead(200, { "Content-Type": "text/plain" });
		var qs = JSON.parse(data);
		var filename = "./public/json/questions.json";
		fs.readFile(filename, "utf-8", function(err, v) {
			if(err) throw err;
			var jsonContent = JSON.parse(v);
			for(value in jsonContent) {
				if((jsonContent[value].level == qs.level) && (jsonContent[value].subject == qs.subject)) {
					jsonContent[value].question = qs.question;
					jsonContent[value].choices.a = qs.choicea;
					jsonContent[value].choices.b = qs.choiceb;
					jsonContent[value].choices.c = qs.choicec;
					jsonContent[value].answer = qs.answer;
				}
			}
			fs.writeFile(filename, JSON.stringify(jsonContent, null, 4), "utf-8", function (err) {
				if (err) throw err;
				console.log("DONE!\n" + qs.question + "\n" + qs.choicea + " " + qs.choiceb + " " + qs.choicec + " " + qs.answer + "\nInserted");
			});
		})
		res.end(`Thank YOU: ${JSON.stringify(qs)}`);
	});
})

express.listen(8698);
