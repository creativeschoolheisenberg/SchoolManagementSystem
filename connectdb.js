var sqlite3 = require('sqlite3').verbose();
var session = require("./session");
var sha1 = require('sha1');
var sessions = "";

exports.checkUser = function(data, callback) {
	var dbLogin = new sqlite3.Database('loginUser.db');
	var pass = sha1(data.username + data.password);
	var query = "SELECT * FROM user_info WHERE username = " + "'" + data.username + "'";
	dbLogin.serialize(function () {
		dbLogin.all(query, function (err, row) {
			if (err) throw err;
			else if (row.length != 0) {
				var status = {};
				if (row[0].password == pass) {
					status = {
						"status" : "ok"
					}
				}
				else {
					status = {
						"status" : "error"
					}
				}
				callback(status);
			}
		});
	});
	dbLogin.close();
}

exports.login = function(data, callback) {
	var dbLogin = new sqlite3.Database('loginUser.db');
	var pass = sha1(data.username + data.password);
	var query = "SELECT * FROM user_info WHERE username = " + "'" + data.username + "'";
	dbLogin.serialize(function () {
		dbLogin.all(query, function (err, row) {
			if (err) throw err;
			else if (row.length != 0) {
				if (row[0].password == pass) {
					session.startSession(data.username, function (id) {
						console.log("Started Session: " + id);
						var sessionId = id;
						var account = row[0].department;
						var status = {
							"token": sessionId,
							"username": data.username,
							"account" : account,
							"status" : "ok"
						}
						callback(status);
					});
				}
				else {
					var status = {
						"status" : "error"
					}
					callback(status);
				}
			}
		});
	});
	dbLogin.close();
}

exports.signup = function(data, callback) {
	var pass = sha1(data.username + data.password);
	var dbLogin = new sqlite3.Database('loginUser.db');
	dbLogin.serialize(function () {
		dbLogin.run("CREATE TABLE if not exists user_info (username text primary key, firstname text, lastname text, password text, department text)");
		var loginIns = dbLogin.prepare("INSERT INTO user_info VALUES (?, ?, ?, ?, ?)");
		loginIns.run(data.username, data.firstname, data.lastname, pass, data.accounttype);
		loginIns.finalize();
		dbLogin.each("SELECT * FROM user_info WHERE username = '" + data.username + "'", function(err, row) {
			var status = {};
			if(row != undefined) {
				status = {
					"status" : "ok"
				}
			}
			else {
				status = {
					"status" : "error"
				}
			}
			callback(status);
		})
	});
	dbLogin.close();
}

exports.addPreNurseryStudent = function(data, callback) {
	var tablename = "pre_nursery_info";
	var dbname = "CreativeStudents.db";
	generateStudentNumber("", dbname, tablename, function(id) {
		var dbStuds = new sqlite3.Database(dbname);
		dbStuds.serialize(function() {
			dbStuds.run("CREATE TABLE if not exists " + tablename + "(StudentNumber int primary key, SummerYear text, Filename text, ImageData blob, Schedule text, LastName text, FirstName text," +
				"MiddleInitial char(2), Nickname text, Gender char(1), DateOfBirth date, PlaceOfBirth text, Address text, ContactNumber text, DateAdmitted date, MotherLastName text," +
				"MotherFirstName text, MotherMiddleInitial char(2), MotherOccupation text, MotherBusAdd text, MotherCell text, MotherEmail text, FatherLastName text," +
				"FatherFirstName text, FatherMiddleInitial char(2), FatherOccupation text, FatherBusAdd text, FatherCell text, FatherEmail text, NumberOfSiblings int," +
				"SiblingName text, SiblingGender text, SiblingAge text, SiblingSchoolName text, BirthCertificate bit, Registration bit, ReferrerName text, Relation text, OtherMeans text)");
			var preNurseryIns = dbStuds.prepare("INSERT INTO " + tablename + " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?," +
				"?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			preNurseryIns.run(id, data.summerYear, data.filename, data.base64, data.schedule, data.lastName, data.firstName, data.middleName, data.nickname, data.gender,
				data.month + "/" + data.day + "/" + data.year, data.placeBirth, data.address, data.contactNumber, data.dateAdmitted, data.momLastName, data.momFirstName, data.momMiddleName,
				data.momOccupation, data.momBusAdd, data.momCellphone, data.momEmail, data.popLastName, data.popFirstName, data.popMiddleName, data.popOccupation,
				data.popBusAdd, data.popCellphone, data.popEmail, data.siblings, data.siblingName, data.siblingGender, data.siblingAge, data.siblingSchool,
				data.birthCert, data.registered, data.referrername, data.relation, data.otherMeans);
			preNurseryIns.finalize();
			dbStuds.each("SELECT StudentNumber FROM " + tablename + " where StudentNumber = " + id, function (err, row) {
				var status = {};
				if(row.StudentNumber != null) {
					status = {
						"status" : "ok"
					}
				}
				else {
					status = {
						"status" : "error"
					}
				}
				callback(status);
			});
		});
		dbStuds.close();
	});
}

exports.addCreativeStudent = function(data, callback) {
	var tablename = "student_info";
	var dbname = "CreativeStudents.db";
	generateStudentNumber(data.studentNumber, dbname, tablename, function(id) {
		var dbStuds = new sqlite3.Database(dbname);
		dbStuds.serialize(function () {
			dbStuds.run("CREATE TABLE if not exists " + tablename + "(StudentNumber int primary key, LRN int, SchoolYear text, FileName text, ImageData blob, LastName text, FirstName text," +
				"MiddleInitial char(2), Nickname text, GradeLevel char(7), Gender char(1), DateOfBirth date, PlaceOfBirth text, Address text, ContactNumber text," + 
				"DateAdmitted date, BirthCertificate bit, Form138E bit, Form137E bit, Registration bit, MotherLastName text, MotherFirstName text, MotherMiddleInitial char(2)," +
				"MotherOccupation text, MotherBusAdd text, MotherCell text, MotherEmail text, FatherLastName text, FatherFirstName text, FatherMiddleInitial char(2)," +
				"FatherOccupation text, FatherBusAdd text, FatherCell text, FatherEmail text, PreviousGradeLevel text, PreviousSchoolName text, PreviousYear text," +
				"NumberOfSiblings int, SiblingName text, SiblingGender text, SiblingAge text, SiblingSchoolName text, ReferrerName text, Relation text, OtherMeans text)");
			var studIns = dbStuds.prepare("INSERT INTO " + tablename + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?," +
				"?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			studIns.run(id, data.LRN, data.schoolYear, data.filename, data.base64, data.lastName, data.firstName, data.middleName, data.nickname, data.gradeLevel, data.gender, 
				data.month + "/" + data.day + "/" + data.year, data.placeBirth, data.address, data.contactNumber, data.dateAdmitted, data.birthCert, data.F138E, data.F137E, 
				data.registered, data.momLastName, data.momFirstName, data.momMiddleName, data.momOccupation, data.momBusAdd, data.momCellphone, data.momEmailAdd, 
				data.popLastName, data.popFirstName, data.popMiddleName, data.popOccupation, data.popBusAdd, data.popCellphone, data.popEmailAdd, data.prevLevel, 
				data.prevSchool, data.prevYear, data.siblings, data.siblingName, data.siblingGender, data.siblingAge, data.siblingSchool, data.referrerName, 
				data.relation, data.otherMeans);
			studIns.finalize();
			dbStuds.each("SELECT StudentNumber FROM " + tablename + " WHERE StudentNumber = " + id, function (err, row) {
				var status = {};
				if(row.StudentNumber != null) {
					status = {
						"status" : "ok"
					}
				}
				else {
					status = {
						"status" : "error"
					}
				}
				callback(status);
			});
		});
		dbStuds.close();
	});
}

exports.addLCPAStudent = function(data, callback) {
	var tablename = "lcpa_student_info";
	var dbname = "LCPAStudents.db"
	generateStudentNumber("", dbname, tablename, function(id) {
		var dbStuds = new sqlite3.Database(dbname);
		dbStuds.serialize(function () {
			dbStuds.run("CREATE TABLE if not exists " + tablename + "(StudentNumber int primary key, LCPAYear text, FileName text, ImageData blob, Course text, Sched text," +
				"LastName text, FirstName text, MiddleInitial char(2), Nickname text, Gender char(1), DateOfBirth date, PlaceOfBirth text, Address text," +
				"HomeNumber text, CellphoneNumber text, DateAdmitted date, Workshop text, WorkshopSchool text, WorkshopYear text, NumberOfSiblings int, SiblingName text," +
				"SiblingGender text, SiblingAge text, SiblingSchoolName text, ReferrerName text, Relation text, OtherMeans text)");
			var studIns = dbStuds.prepare("INSERT INTO " + tablename + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			studIns.run(id, data.LCPAYear, data.filename, data.base64, data.course, data.sched, data.lastName, data.firstName, data.middleName, data.nickname, data.gender, 
				data.month + "/" + data.day + "/" + data.year, data.placeBirth, data.address, data.homeNumber, data.cellphoneNumber, data.dateAdmitted, data.workshop,
				data.workshopSchool, data.workshopYear, data.siblings, data.siblingName, data.siblingGender, data.siblingAge, data.siblingSchool, data.referrerName, 
				data.relation, data.otherMeans);
			studIns.finalize();
			dbStuds.each("SELECT StudentNumber FROM " + tablename + " WHERE StudentNumber = " + id, function (err, row) {
				var status = {};
				if(row.StudentNumber != null) {
					status = {
						"status" : "ok"
					}
				}
				else {
					status = {
						"status" : "error"
					}
				}
				callback(status);
			});
		});
		dbStuds.close();
	});
}

exports.enrolCreativeStudent = function(data, callback) {
	var tablename = "enroled_students";
	var dbStuds = new sqlite3.Database("CreativeStudents.db");
	dbStuds.serialize(function () {
		dbStuds.run("CREATE TABLE if not exists " + tablename + "(StudentNumber int primary key, RegistrationNumber int, SchoolYear text, DateEnroled date," +
			"GradeLevel char(7), PaymentPlan char(5), TotalAmountDue decimal(18, 2), TuitionFee decimal(18, 2), MiscellaneousFee decimal(18, 2), OtherFee decimal(18, 2)," +
			"Reservation decimal(18, 2), Voucher decimal(18, 2), VoucherSerial text, DiscountType text, Discount decimal(18, 2), UponEnrolment decimal(18, 2)," +
			"InstallmentFee decimal(18, 2), Payments int, TotalBalance decimal(18, 2), BooksNotebooks decimal(18, 2), BooksNotebooksBalance decimal(18, 2))");
		var studIns = dbStuds.prepare("INSERT INTO " + tablename + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
		studIns.run(data.studentNumber, data.registrationNumber, data.schoolYear, data.dateEnroled, data.gradeLevel, data.paymentplan, data.totalAmountDue,
			data.tuitionFee, data.miscellaneousFee, data.otherFee, data.reservation, data.voucher, data.voucherSerial, data.discountType, data.discount,
			data.uponEnrolment, data.installmentFee, data.payments, data.totalBalance, data.booksNotebooks, data.booksNotebooksBalance, function(err, row) {
				callback(err);
		});
		studIns.finalize();
	});
	dbStuds.close();
}

exports.enrolLCPAStudent = function(data, callback) {
	var tablename = "enroled_students";
	var dbStuds = new sqlite3.Database("LCPAStudents.db");
	dbStuds.serialize(function () {
		dbStuds.run("CREATE TABLE if not exists " + tablename + "(StudentNumber int primary key, RegistrationNumber int, SchoolYear text, DateEnroled date," +
			"TotalAmountDue decimal(18, 2), RegistrationFee decimal(18, 2), TotalCourseFee decimal(18, 2), RecitalFee decimal(18, 2)," +
			"Discount decimal(18, 2), TotalAmountToPay decimal(18, 2), TotalBalance decimal(18, 2))");
		var studIns = dbStuds.prepare("INSERT INTO " + tablename + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
		studIns.run(data.studentNumber, data.registrationNumber, data.schoolYear, data.dateEnroled, data.totalAmountDue, data.regfee, data.totalCourseFee,
			data.recitalFee, data.discount, data.totalAmountToPay, data.totalBalance, function(err, row) {
				callback(err);
		});
		studIns.finalize();
	});
	dbStuds.close();
}

exports.saveFees = function(data, callback) {
	var dbStuds = new sqlite3.Database("CreativeStudents.db");
	dbStuds.serialize(function () {
		dbStuds.run("CREATE TABLE if not exists school_fees (PaymentPlan char(8) primary key, TuitionFee decimal(18, 2), InstructionalFee decimal(18, 2), " +
			"MIFee decimal(18, 2), MiscellaneousFee decimal(18, 2), RegistrationFee decimal(18, 2), LibraryFee decimal(18, 2), AthleticFee decimal(18, 2), " +
			"LaboratoryFee decimal(18, 2), ClassroomMaterialsFee decimal(18, 2), ComputerInternetFee decimal(18, 2), AudioVisualFee decimal(18, 2), MedicalDentalFee decimal(18, 2), " +
			"IDFee decimal(18, 2), InsuranceFee decimal(18, 2), DevelopmentMaintenanceFee decimal(18, 2), OtherFee decimal(18, 2), EnergyFee decimal(18, 2), " +
			"EducationalTourFee decimal(18, 2), SchoolProgramsFee decimal(18, 2), PreSchoolBooks decimal(18, 2), BooksNotebooks decimal(18, 2), " +
			"Books decimal(18, 2), Notebooks decimal(18, 2), TotalFee decimal(18, 2), UponEnrolment decimal(18, 2), InstallmentFee decimal(18, 2), Payments int)");
		var studIns = dbStuds.prepare("INSERT INTO school_fees VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
		studIns.run(data.paymentPlan, data.tuitionFee, data.instructionalFee, data.miFee, data.miscellaneousFee, data.registrationFee, data.libraryFee, data.athleticFee,
			data.labFee, data.classroomMaterialsFee, data.computerInternetFee, data.audioVisualFee, data.medicalDentalFee, data.idFee, data.insuranceFee,
			data.developmentMaintenanceFee, data.otherFee, data.energyFee, data.educationalTourFee, data.schoolProgramsFee, data.preSchoolBooks, 
			data.booksNotebooks, data.books, data.notebooks, data.totalFee, data.uponEnrolment, data.installmentFee, data.payments, function(err, row) {
				callback(err);
			});
		studIns.finalize();
	});
	dbStuds.close();
	
}

exports.saveLCPAFees = function(data, callback) {
	var dbStuds = new sqlite3.Database("LCPAStudents.db");
	dbStuds.serialize(function () {
		dbStuds.run("CREATE TABLE if not exists lcpa_fees (PaymentPlan char(4) primary key, RegistrationFee int, VoiceFee int, DrumsFee int, DanceFee int," +
				"Piano1Fee int, Piano2Fee int, PaintingFee int, ViolinFee int, GuitarFee int, RecitalFee int)");
		var studIns = dbStuds.prepare("INSERT INTO lcpa_fees VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
		studIns.run(data.plan, data.registrationFee, data.voice, data.drums, data.dance, data.piano1, data.piano2, data.painting, data.violin, 
			data.guitar, data.recitalFee, function(err, row) {
				callback(err);
			});
		studIns.finalize();
	});
	dbStuds.close();
	
}

exports.updateFees = function(data, callback) {
	var dbStuds = new sqlite3.Database('CreativeStudents.db');
	dbStuds.serialize(function () {
		var studIns = dbStuds.prepare("UPDATE school_fees SET TuitionFee = ?, InstructionalFee = ?, MIFee = ?, MiscellaneousFee = ?, RegistrationFee = ?, LibraryFee = ?, " +
		"AthleticFee = ?, LaboratoryFee = ?, ClassroomMaterialsFee = ?, ComputerInternetFee = ?, AudioVisualFee = ?, MedicalDentalFee = ?, IDFee = ?, InsuranceFee = ?," +
		"DevelopmentMaintenanceFee = ?, OtherFee = ?, EnergyFee = ?, EducationalTourFee = ?, SchoolProgramsFee = ?, PreSchoolBooks = ?, BooksNotebooks = ?," +
		"Books = ?, Notebooks = ?, TotalFee = ?, UponEnrolment = ?, InstallmentFee = ?, Payments = ? WHERE PaymentPlan = ?");
		studIns.run(data.tuitionFee, data.instructionalFee, data.miFee, data.miscellaneousFee, data.registrationFee, data.libraryFee, data.athleticFee, data.labFee, data.classroomMaterialsFee,
			data.computerInternetFee, data.audioVisualFee, data.medicalDentalFee, data.idFee, data.insuranceFee, data.developmentMaintenanceFee, data.otherFee, data.energyFee,
			data.educationalTourFee, data.schoolProgramsFee, data.preSchoolBooks, data.booksNotebooks, data.books, data.notebooks, data.totalFee, data.paymentPlan, 
			data.uponEnrolment, data.installmentFee, data.payments, function(err, row) {
				callback(err);
			});
		studIns.finalize();
	});
	dbStuds.close();
}

exports.updateLCPAFees = function(data, callback) {
	var dbStuds = new sqlite3.Database("LCPAStudents.db");
	dbStuds.serialize(function () {
		var studIns = dbStuds.prepare("UPDATE lcpa_fees SET RegistrationFee = ?, VoiceFee = ?, DrumsFee = ?, DanceFee = ?, Piano1Fee = ?, Piano2Fee = ?, PaintingFee = ?, " +
			"ViolinFee = ?, GuitarFee = ?, RecitalFee = ? WHERE PaymentPlan = ?");
		studIns.run(data.registrationFee, data.voice, data.drums, data.dance, data.piano1, data.piano2, data.painting, data.violin, data.guitar, 
			data.recitalFee, data.plan, function(err, row) {
				callback(err);
			});
		studIns.finalize();
	});
	dbStuds.close();
}

exports.showFees = function(data, callback) {
	var dbStuds = new sqlite3.Database('CreativeStudents.db');
		dbStuds.serialize(function () {
			dbStuds.each("SELECT PaymentPlan as plan, * FROM school_fees WHERE PaymentPlan = " + "'" + data.paymentPlan + "'", function (err, row) {
				var status = {};
				if (err) {
					status = {
						"status" : "error"
					}
				}
				else {
					status = {
						"tuition": row.TuitionFee,
						"instruction": row.InstructionalFee,
						"mi": row.MIFee,
						"miscellaneous": row.MiscellaneousFee,
						"regfee": row.RegistrationFee,
						"libfee": row.LibraryFee,
						"athfee": row.AthleticFee,
						"labfee": row.LaboratoryFee,
						"classmat": row.ClassroomMaterialsFee,
						"computer": row.ComputerInternetFee,
						"avr": row.AudioVisualFee,
						"medical": row.MedicalDentalFee,
						"id": row.IDFee,
						"insurance": row.InsuranceFee,
						"development": row.DevelopmentMaintenanceFee,
						"others": row.OtherFee,
						"energy": row.EnergyFee,
						"eductour": row.EducationalTourFee,
						"schoolprog": row.SchoolProgramsFee,
						"preBooks": row.PreSchoolBooks,
						"booksNotebooksElem": row.BooksNotebooks,
						"books": row.Books,
						"notebooks": row.Notebooks,
						"total": row.TotalFee,
						"uponEnrolment": row.UponEnrolment,
						"installment": row.InstallmentFee,
						"payments": row.Payments
					}
				}
				callback(status);
			});
		});
		dbStuds.close();
}

exports.showLCPAFees = function(data, callback) {
	var dbStuds = new sqlite3.Database('LCPAStudents.db');
		dbStuds.serialize(function () {
			dbStuds.each("SELECT PaymentPlan as plan, * FROM lcpa_fees WHERE PaymentPlan = " + "'" + data.plan + "'", function (err, row) {
				var status = {};
				if (err) {
					status = {
						"status" : "error"
					}
				}
				else {
					status = {
						"regfee": row.RegistrationFee,
						"voice": row.VoiceFee,
						"drums": row.DrumsFee,
						"dance": row.DanceFee,
						"piano1": row.Piano1Fee,
						"piano2": row.Piano2Fee,
						"painting": row.PaintingFee,
						"violin": row.ViolinFee,
						"guitar": row.GuitarFee,
						"recitalFee" : row.RecitalFee
					}
				}
				callback(status);
			});
		});
		dbStuds.close();
}

exports.fetchPreNurseryInformation = function(data, callback) {
	var dbStuds = new sqlite3.Database('CreativeStudents.db');
	dbStuds.serialize(function(){
		dbStuds.get("SELECT * FROM pre_nursery_info WHERE LastName LIKE '" + data.lastname + "' AND FirstName Like '" + data.firstname + "%'", function(err, row) {
			if(err) throw err;
			if(row != undefined) {
				callback(row);
			}
			else {
				var status = {
					"status" : "error"
				}
				callback(status);
			}
		})
	});
	dbStuds.close();
}

exports.searchStudent = function(data, callback) {
	var count = Object.keys(data).length;
	var string = "";
	if(count >= 2) {
		string = "SELECT * FROM student_info WHERE LastName LIKE '" + data.lastName + "' AND FirstName LIKE '" + data.firstName + "%'";
	}
	else {
		string = "SELECT * FROM student_info WHERE StudentNumber = " + data.studentNumber;
	}
	var dbStuds = new sqlite3.Database('CreativeStudents.db');
	dbStuds.serialize(function() {
		dbStuds.get(string, function (err, row) {
			if (err) throw err;
			var status = {};
			if(row != undefined) {
				status = {
					"studentNumber": row.StudentNumber,
					"LRN": row.LRN,
					"imageData": row.ImageData,
					"lastName": row.LastName,
					"firstName": row.FirstName,
					"middleName" : row.MiddleInitial,
					"nickname": row.Nickname,
					"gradeLevel": row.GradeLevel,
					"gender": row.Gender,
					"dateOfBirth": row.DateOfBirth,
					"placeOfBirth": row.PlaceOfBirth,
					"address": row.Address,
					"contactNumber": row.ContactNumber,
					"birthCert": row.BirthCertificate,
					"form138E": row.Form138E,
					"form137E" : row.Form137E,
					"motherLastName": row.MotherLastName,
					"motherFirstName": row.MotherFirstName,
					"motherMiddleInitial": row.MotherMiddleInitial,
					"motherOccupation": row.MotherOccupation,
					"motherBusAdd": row.MotherBusAdd,
					"motherCell": row.MotherCell,
					"motherEmail": row.MotherEmail,
					"fatherLastName": row.FatherLastName,
					"fatherFirstName": row.MotherFirstName,
					"fatherMiddleInitial": row.FatherMiddleInitial,
					"fatherOccupation": row.FatherOccupation,
					"fatherBusAdd": row.FatherBusAdd,
					"fatherCell": row.FatherCell,
					"fatherEmail": row.FatherEmail,
					"previousGradeLevel": row.PreviousGradeLevel,
					"previousSchoolName": row.PreviousSchoolName,
					"previousYear": row.PreviousYear,
					"siblings": row.NumberOfSiblings,
					"siblingName": row.SiblingName,
					"siblingGender": row.SiblingGender,
					"siblingAge": row.SiblingAge,
					"siblingSchoolName": row.SiblingSchoolName,
					"referrerName": row.ReferrerName,
					"relation": row.Relation,
					"otherMeans": row.OtherMeans
				}
			}
			else {
				status = {
					"status": "error"
				}
			}
			callback(status);
		});
	});
	dbStuds.close();
}

exports.searchLCPAStudent = function(data, callback) {
	var count = Object.keys(data).length;
	var string = "";
	if(count >= 2) {
		string = "SELECT * FROM lcpa_student_info WHERE LastName LIKE '" + data.lastName + "' AND FirstName LIKE '" + data.firstName + "%'";
	}
	else {
		string = "SELECT * FROM lcpa_student_info WHERE StudentNumber = " + data.studentNumber;
	}
	var dbStuds = new sqlite3.Database('LCPAStudents.db');
	dbStuds.serialize(function() {
		dbStuds.get(string, function (err, row) {
			if (err) throw err;
			var status = {};
			if(row != undefined) {
				status = {
					"studentNumber": row.StudentNumber,
					"lastName": row.LastName,
					"firstName": row.FirstName,
					"middleName" : row.MiddleInitial,
					"course" : row.Course
				}
			}
			else {
				status = {
					"status": "error"
				}
			}
			callback(status);
		});
	});
	dbStuds.close();
}

exports.checkStudentNumber = function(studentNumber, callback) {
	var dbStuds = new sqlite3.Database("CreativeStudents.db");
	dbStuds.serialize(function() {
		dbStuds.each("SELECT StudentNumber FROM student_info where StudentNumber = " + studentNumber, function(err, row) {
			var status = {};
			if(row != undefined) {
				status = {
					"status" : "error"
				}
			}
			else {
				status = {
					"status" : "ok"
				}
			}
			callback(status);
		});
	});
	dbStuds.close();
}

function generateStudentNumber(studentNumber, dbname, tablename, callback) {
	if(studentNumber == "") {
		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth();
		var dbStuds = new sqlite3.Database(dbname);
		dbStuds.serialize(function () {
			dbStuds.each("SELECT StudentNumber FROM " + tablename + " ORDER BY StudentNumber DESC LIMIT 1", function (err, row) {
				var id = "";
				if(err) {
					var id = year + "001";
				}
				else if(row.StudentNumber != null) {
					var str = row.StudentNumber.toString();
					if((year >	str.slice(0, 4)) && (month > 3)) {
						id = year + "001";
					}
					else {
						id = row.StudentNumber + 1;
					}
				}
				callback(id);
			});
		});
		dbStuds.close();
	}
	else {
		callback(studentNumber);
	}
}
