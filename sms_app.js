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
var crypto = require('crypto');
var redis = require('redis');
var client = redis.createClient();
var fs = require("fs");
var sessionId;

function startSession(name, callback) {
	var id = crypto.randomBytes(16).toString('hex');
	client.set(id, name, function() {
		callback(id)
	});
}

function getUser(sessionid, callback) {
	client.get(sessionid, function(err, reply) {
		callback(reply)
	});
}

function endSession(sessionid, callback) {
	client.del(sessionid, function(err, reply) {
		callback()
	});
}

function errorSession(res) {
	res.writeHead(404, {"Content-Type" : "text/html"});
	res.write('<p><h2>You are not yet granted access!</h2></p>');
	res.end('<p>Proceed to the <a href="/">Login Page</p>');
}

express.get("/", function(req, res) {
	file.serveFile("/login.html", 200 , {}, req, res);
})

express.get("/common_layout.css", function(req, res) {
	file.serveFile("/common_layout.css", 200, {}, req, res);
})

express.get("/login-layout.css", function(req, res) {
	file.serveFile("/login-layout.css", 200, {}, req, res);
})

express.get("/home_layout.css", function(req, res) {
	file.serveFile("/home_layout.css", 200, {}, req, res);
})

express.get("/table-sidebar-layout.css", function(req, res) {
	file.serveFile("/table-sidebar-layout.css", 200, {}, req, res);
})

express.get("/button-layout.css", function(req, res) {
	file.serveFile("/button-layout.css", 200, {}, req, res);
})

express.get("/images/miPie.png", function(req, res) {
	file.serveFile("/images/miPie.png", 200, {}, req, res);
})

express.get("/accounting_layout.css", function(req, res) {
	file.serveFile("/accounting_layout.css", 200, {}, req, res);
})

express.get("/accounting/accounting_layout.css", function(req, res) {
	file.serveFile("/accounting_layout.css", 200, {}, req, res);
})

express.get("/accounting/home_layout.css", function(req, res) {
	file.serveFile("/home_layout.css", 200, {}, req, res);
})

express.get("/admission/table-sidebar-layout.css", function(req, res) {
	file.serveFile("/table-sidebar-layout.css", 200, {}, req, res);
})

express.get("/admission/button-layout.css", function(req, res) {
	file.serveFile("/button-layout.css", 200, {}, req, res);
})

express.get("/admission/common_layout.css", function(req, res) {
	file.serveFile("/common_layout.css", 200, {}, req, res);
})

express.get("/accounting/table-sidebar-layout.css", function(req, res) {
	file.serveFile("/table-sidebar-layout.css", 200, {}, req, res);
})

express.get("/accounting/button-layout.css", function(req, res) {
	file.serveFile("/button-layout.css", 200, {}, req, res);
})

express.get("/accounting/common_layout.css", function(req, res) {
	file.serveFile("/common_layout.css", 200, {}, req, res);
})

express.get("/login.js", function(req, res) {
	file.serveFile("/login.js", 200, {}, req, res);
})

express.get("/admission/admission.js", function(req, res) {
	file.serveFile("admission.js", 200, {}, req, res);
})

express.get("/accounting/fees.js", function(req, res) {
	file.serveFile("fees.js", 200, {}, req, res); 
})

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
						startSession(profile.username, function(id) {
							console.log("Started Session: " + id);
							sessionId = id;
							status = {
								"token" : sessionId,
								"username" : profile.username
							}
							res.end(JSON.stringify(status), 200,'application/json');
						});		
						// var sessionId = createSession(profile.username);
						// sessions[sessionId] = profile.username;
						// status = {
						// 	"token" : sessionId
						// }
						// res.end(JSON.stringify(status), 200,'application/json');
					}
					else {
						res.end("error");
					}
				}
			});
		});
	});
})

express.post("/logout", function(req, res) {
	var data = "";
	req.on('data', function(dd) {
		data += dd.toString();
	});
	req.on('end', function() {
		res.writeHead(200, {"Content-Type" : "text/plain"});
		var profile = JSON.parse(data);
		endSession(profile.mySession, function() {
			console.log("Session ended: " + profile.mySession);
		})
		status = {
			"message" : "YES"
		}
		res.end(JSON.stringify(status), 200, 'application/json');
	});
})

express.get("/thankyou", function(req, res) {
	file.serveFile("/thankyou.html", 200 , {}, req, res);
})

express.post("/addStudent", function(req, res) {
	var data = "";
	req.on('data', function(dd) {
		data += dd.toString();
	});
	req.on('end', function() {
		res.writeHead(200, {"Content-Type" : "text/plain"});
		var qs = JSON.parse(data);
		var dbStuds = new sqlite3.Database('CSSPStudents.db');
		dbStuds.serialize(function() {
			//FOR STUDENT RECORD
			dbStuds.run("CREATE TABLE if not exists student_info (StudentNumber int primary key, LastName text, " +
			"FirstName text, MiddleInitial char(2), GradeLevel char(7), Gender char(1), " +
			"DateOfBirth date, PlaceOfBirth text, Age int, HomeAddress text, TelNumber text, " +
			"Enroled bit)");
			var studIns = dbStuds.prepare("INSERT INTO student_info VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			studIns.run(qs.studNumber, qs.lName, qs.fName, qs.mi, qs.gradeLevel, qs.gender, qs.month + " " + qs.day + ", " + qs.year, qs.placeBirth, qs.studAge, qs.address, qs.telNo, 0);
			studIns.finalize();
			dbStuds.each("SELECT StudentNumber as id, * FROM student_info", function(err, row) {
				if(err) throw err;
				console.log(row.id + ": " + row.LastName + " " + row.FirstName + " " + row.MiddleInitial + " " + row.GradeLevel + " " +
				row.Gender + " " + row.DateOfBirth + " " + row.PlaceOfBirth + " " + row.Age + " " + row.HomeAddress + " " + 
				row.TelNumber + " " +  	row.Enroled);
			});
			//FOR PARENT RECORD
			dbStuds.run("CREATE TABLE if not exists parent_info (StudentNumber int, MotherLastName text, MotherFirstName text, " +
			"MotherMiddleInitial char(2), MotherOccupation text, MotherBusAdd text, MotherTelNo text, MotherEmail text, MotherCell text, " +
			"FatherLastName text, FatherFirstName text, FatherMiddleInitial char(2), FatherOccupation text, FatherBusAdd text, " +
			"FatherTelNo text, FatherEmail text, FatherCell text)");
			var parIns = dbStuds.prepare("INSERT INTO parent_info VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			parIns.run(qs.studNumber, qs.mlName, qs.mfName, qs.mmi, qs.mOccupation, qs.mBusAdd, qs.mTelNo, qs.mEmail, qs.mCell, qs.flName, 
				qs.ffName, qs.fmi, qs.fOccupation, qs.fBusAdd, qs.fTelNo, qs.fEmail, qs.fCell);
				parIns.finalize();
				dbStuds.each("SELECT StudentNumber as id, * FROM parent_info", function(err, row) {
					if(err) throw err;
					console.log(row.id + ": " + row.MotherLastName + " " + row.MotherFirstName + " " + row.MotherMiddleInitial + " " + 
					row.MotherOccupation + " " + row.MotherBusAdd + " " + row.MotherTelNo + " " + row.MotherEmail + " " +
					row.MotherCell + " " + row.FatherLastName + " " + row.FatherFirstName + " " + row.FatherMiddleInitial + " " + 
					row.FatherOccupation + " " + row.FatherBusAdd + " " + row.FatherTelNo + " " + row.FatherEmail + " " + 
					row.FatherCell);
				});
			});
			dbStuds.close();
			res.end(`Thank YOU: ${JSON.stringify(qs)}`);
		});
	})
	
	express.post("/searchStudent", function(req, res) {
		console.log("SEARCHSTUDENT");
		var data = "";
		req.on('data', function(dd) {
			data += dd.toString();
		}); 	
		req.on('end', function() {
			var qs = JSON.parse(data);
			var dbStuds = new sqlite3.Database('CSSPStudents.db');
			dbStuds.serialize(function() {
				dbStuds.each("SELECT StudentNumber as id, * FROM student_info WHERE StudentNumber = " + qs.searchStudNumber, function(err, row) {
					if(err) throw err;
					var status = {
						"lastName" : row.LastName,
						"firstName" : row.FirstName,
						"initials" : row.MiddleInitial,
						"level" : row.GradeLevel
					}
					res.end(JSON.stringify(status), 200, 'application/json');
					console.log(row.id + ": " + row.LastName + " " + row.FirstName + " " + row.MiddleInitial + " " + row.GradeLevel + " " +
					row.Gender + " " + row.DateOfBirth + " " + row.PlaceOfBirth + " " + row.Age + " " + row.HomeAddress + " " + 
					row.TelNumber + " " +  	row.Enroled);
				});
			});
			dbStuds.close();
		});
	})
	
	express.post("/showFees", function(req, res) {
		console.log("SHOW FEES");
		var data = "";
		req.on('data', function(dd) {
			data += dd.toString();
		}); 	
		req.on('end', function() {
			var qs = JSON.parse(data);
			var dbStuds = new sqlite3.Database('CSSPStudents.db');
			dbStuds.serialize(function() {
				dbStuds.each("SELECT PaymentPlan as plan, * FROM school_fees WHERE PaymentPlan = " + "'" + qs.paymentPlan + "'", function(err, row) {
					// Investigate on the output of qs.paymentPlan
					// if the data is not yet existing
					if(err) throw err;
					if(row !== undefined) {
						var status = {
							"tuitionFee" : row.TuitionFee,
							"instructionalFee" : row.InstructionalFee,
							"miFee" : row.MIFee,
							"miscellaneousFee" : row.MiscellaneousFee,
							"registrationFee" : row.RegistrationFee,
							"libraryFee" : row.LibraryFee,
							"athleticFee" : row.AthleticFee,
							"classroomMaterialsFee" : row.ClassroomMaterialsFee,
							"computerInternetFee" : row.ComputerInternetFee,
							"audioVisualFee" : row.AudioVisualFee,
							"medicalDentalFee" : row.MedicalDentalFee,
							"idFee" : row.IDFee,
							"insuranceFee" : row.InsuranceFee,
							"developmentMaintenanceFee" : row.DevelopmentMaintenanceFee,
							"otherFee" : row.OtherFee,
							"energyFee" : row.EnergyFee,
							"educationalTourFee" : row.EducationalTourFee,
							"schoolProgramsFee" : row.SchoolProgramsFee,
							"booksNotebooksFee" : row.BooksNoteBooksFee,
							"totalFee" : row.TotalFee
						}
						res.end(JSON.stringify(status), 200, 'application/json');
					}
					else {
						console.log("Table does not yet exist");
					}
				});
			});
			dbStuds.close();
		});
	})
	
	express.post("/updateFees", function(req, res) {
		var data = "";
		req.on('data', function(dd) {
			data += dd.toString();
		});
		req.on('end', function() {
			res.writeHead(200, {"Content-Type" : "text/plain"});
			var qs = JSON.parse(data);
			var dbStuds = new sqlite3.Database('CSSPStudents.db');
			dbStuds.serialize(function() {
				dbStuds.run("CREATE TABLE if not exists school_fees (PaymentPlan char(8) primary key, TuitionFee decimal(18, 2), InstructionalFee decimal(18, 2), " +
					"MIFee decimal(18, 2), MiscellaneousFee decimal(18, 2), RegistrationFee decimal(18, 2), LibraryFee decimal(18, 2), AthleticFee decimal(18, 2), " +
					"ClassroomMaterialsFee decimal(18, 2), ComputerInternetFee decimal(18, 2), AudioVisualFee decimal(18, 2), MedicalDentalFee decimal(18, 2), " +
					"IDFee decimal(18, 2), InsuranceFee decimal(18, 2), DevelopmentMaintenanceFee decimal(18, 2), OtherFee decimal(18, 2), EnergyFee decimal(18, 2), " +
					"EducationalTourFee decimal(18, 2), SchoolProgramsFee decimal(18, 2), BooksNoteBooksFee decimal(18, 2), TotalFee decimal(18, 2))");
				var studIns = dbStuds.prepare("INSERT INTO school_fees VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
				studIns.run(qs.paymentPlan, qs.tuitionFee, qs.instructionalFee, qs.miFee, qs.miscellaneousFee, qs.registrationFee, qs.libraryFee, qs.athleticFee, 
					qs.classroomMaterialsFee, qs.computerInternetFee, qs.audioVisualFee, qs.medicalDentalFee, qs.idFee, qs.insuranceFee, 
					qs.developmentMaintenanceFee, qs.otherFee, qs.energyFee, qs.educationalTourFee, qs.schoolProgramsFee, qs.booksNotebooksFee, qs.totalFee);
				studIns.finalize();
				// FOR FEES RECORD
				dbStuds.each("SELECT PaymentPlan as plan, * FROM school_fees", function(err, row) {
					if(err) throw err;
					console.log(row.plan + ": " + row.TuitionFee + " " + row.InstructionalFee + " " + row.MIFee + " " + 
									row.MiscellaneousFee + " " + row.RegistrationFee + " " + row.LibraryFee + " " + row.AthleticFee + " " +
									row.ClassroomMaterialsFee + " " + row.ComputerInternetFee + " " + row.AudioVisualFee + " " + row.MedicalDentalFee + " " + 
									row.IDFee + " " + row.InsuranceFee + " " + row.DevelopmentMaintenanceFee + " " + row.OtherFee + " " + row.EnergyFee + " " +
									row.EducationalTourFee + " " + row.SchoolProgramsFee + " " + row.BooksNoteBooksFee + " " + row.TotalFee);
				});
			});
			dbStuds.close();
			res.end(`Thank YOU: ${JSON.stringify(qs)}`);
		});
	})

	express.put("/updateFees", function(req, res) {
		var data = "";
		req.on('data', function(dd) {
			data += dd.toString();
		});
		req.on('end', function() {
			res.writeHead(200, {"Content-Type" : "text/plain"});
			var qs = JSON.parse(data);
			var dbStuds = new sqlite3.Database('CSSPStudents.db');
			dbStuds.serialize(function() {
				var studIns = dbStuds.prepare("UPDATE school_fees SET TuitionFee = ?, InstructionalFee = ?, MIFee = ?, MiscellaneousFee = ?, RegistrationFee = ?, LibraryFee = ?, " +
					"AthleticFee = ?, ClassroomMaterialsFee = ?, ComputerInternetFee = ?, AudioVisualFee = ?, MedicalDentalFee = ?, IDFee = ?, InsuranceFee = ?, DevelopmentMaintenanceFee = ?, " +
					"OtherFee = ?, EnergyFee = ?, EducationalTourFee = ?, SchoolProgramsFee = ?, BooksNoteBooksFee = ?, TotalFee = ? WHERE PaymentPlan = ?");
				studIns.run(qs.tuitionFee, qs.instructionalFee, qs.miFee, qs.miscellaneousFee, qs.registrationFee, qs.libraryFee, qs.athleticFee, qs.classroomMaterialsFee,
					qs.computerInternetFee, qs.audioVisualFee, qs.medicalDentalFee, qs.idFee, qs.insuranceFee, qs.developmentMaintenanceFee, qs.otherFee, qs.energyFee,
					qs.educationalTourFee, qs.schoolProgramsFee, qs.booksNotebooksFee, qs.totalFee, qs.paymentPlan);
				studIns.finalize();
			});
			dbStuds.close();
			res.end(`Thank YOU: ${JSON.stringify(qs)}`);
		});
	})
	
	express.get('/user', function(req, res) {
		res.send(200, 'text/plain', mySessionId);
	})
	
	function doesSessionExist(req, res, string, sessionid) {
		client.exists(sessionid, function(err, reply) {
			if(reply == 1 && sessionid != undefined) {
				getUser(sessionid, function(name) {
					console.log("Hello: " + name);
				});
				file.serveFile("/" + string, 200, {}, req, res);
			} else {
				errorSession(res);
			}
		});
	}
	
	express.get("/index", function(req, res) {
		doesSessionExist(req, res, "index.html", sessionId);
	})
	
	express.get("/home", function(req, res) {
		doesSessionExist(req, res, "index.html", sessionId);
	})
	
	express.get("/accounting", function(req, res) {
		doesSessionExist(req, res, "accounting.html", sessionId);
	})

	express.get("/admission", function(req, res) {
		doesSessionExist(req, res, "admission.html", sessionId);
	})

	express.get("/admission/pre-nursery-admission", function(req, res) {
		doesSessionExist(req, res, "pre-nursery-admission.html", sessionId);
	})
	
	express.get("/admission/cssp-admission", function(req, res) {
		doesSessionExist(req, res, "cssp-admission.html", sessionId);
	})
	
	express.get("/admission/lcpa-admission", function(req, res) {
		doesSessionExist(req, res, "lcpa-admission.html", sessionId);
	})

	express.get("/admission/tutorials", function(req, res) {
		doesSessionExist(req, res, "tutorials.html", sessionId);
	})
	
	express.get("/grading", function(req, res) {
		doesSessionExist(req, res, "grading.html", sessionId);
	})
	
	express.get("/lcpa", function(req, res) {
		doesSessionExist(req, res, "lcpa.html", sessionId);
	})
	
	express.get("/accounting/registration", function(req, res) {
		doesSessionExist(req, res, "registration.html", sessionId);
	})
	
	express.get("/accounting/enrolment", function(req, res) {
		doesSessionExist(req, res, "enrolment.html", sessionId);
	})
	
	express.get("/accounting/payment", function(req, res) {
		doesSessionExist(req, res, "payment.html", sessionId);
	})
	
	express.get("/accounting/enroled-students", function(req, res) {
		doesSessionExist(req, res, "enroled-students.html", sessionId);
	})
	
	express.get("/accounting/notice", function(req, res) {
		doesSessionExist(req, res, "notice.html", sessionId);
	})
	
	express.get("/accounting/fees", function(req, res) {
		doesSessionExist(req, res, "fees.html", sessionId);
	})
	
	express.listen(8013);