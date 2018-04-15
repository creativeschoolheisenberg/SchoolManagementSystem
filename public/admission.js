var siblingText = [ "siblingName", "siblingGender", "siblingAge", "siblingSchoolName" ];
var prevText = [ "prevLevel", "prevSchool", "prevYear" ];

// function nursery() {
// 	let rq = new XMLHttpRequest();
// 	rq.onreadystatechange = function() {
// 		if(rq.readyState == 4) {
// 			var response = JSON.parse(rq.responseText);
// 			var img = document.getElementById("showPhoto");
// 			img.src = response.image;
// 		}
// 	};
// 	rq.open("POST", "/showStudent", true);
// 	rq.setRequestHeader("Content-Type", "application/json");
// 	rq.send(JSON.stringify({
// 		searchStudNumber : document.getElementById('pre-nsched').value
// 	}));
// }

function trim(plan) {
	return plan.replace(/\s/g, "");
}

function studentNumber() {
	// Get the last student number from db
	// then from there increment by 1
}

function display(divID) {
	//var content = document.getElementById('content').childNodes;
	var div = document.getElementById(divID);
	/*for(var i = 0; i < content.length - 2; i++) {
		var id = content[i].nextSibling.id;
		if(id == divID) {
			div.style.display = 'block';
			div.style.background = '#BFF7FF';
			div.style.margin = '0px';
			div.style.overflow = 'hidden';
		}
		else if(id != divID) {
			var other = document.getElementById(id);
			other.style.display = 'none';
			other.style.display = 'white';
		}
		i++;
	}*/
	if(divID == "enrolment") {
		var month = new Date().getMonth();
		var day = new Date().getDate();
		var year = new Date().getFullYear();
		document.getElementById("currentDate").value = month + 1 + "/" + day + "/" + year;
		// document.getElementById("schoolYear").value = determineSchoolYear(month, year);
	}
	else if(divID == "registration") {
		fillDay(document.getElementById("dayBirth"));
		fillYear(document.getElementById("yearBirth"));
		var month = document.getElementById("monthBirth");
		var currentMonth = new Date().getMonth();
		month.selectedIndex = currentMonth;
	}
	else if(divID == "students") {
		var month = new Date().getMonth();
		var year = new Date().getFullYear();
		var studOpt = document.getElementById("syPlan");
		var syPlan = determineSchoolYear(month, year);
		var option = document.createElement("option");
		option.value = syPlan;
		option.text = syPlan;
		studOpt.add(option);
	}
}

function dateOfBirth() {
	var optMonth = document.getElementById("monthBirth");
	var optDay = document.getElementById("dayBirth");
	var optYear = document.getElementById("yearBirth");
	dynamicDay(optMonth, optDay, optYear);
	getBirthDate();
}

function fillDay(day) {
	if(day.options.length == 0) {
		var days = 31;
		var currentDay = new Date().getDate();
		for(var i = 1; i <= days; i++) {
			var option = document.createElement("option");
			option.value = i;
			option.text = i;
			day.add(option);
			if(currentDay == i) {
				day.selectedIndex = i - 1;
			}
		}
	}
}

function fillYear(year) {
	if(year.options.length == 0) {
		var currentYear = new Date().getFullYear();
		var x = 0;
		for(var i = 15; i >= 0; i-- ) {
			var option = document.createElement("option");
			option.value = currentYear - i;
			option.text = currentYear - i;
			year.add(option);
			if(currentYear == currentYear - i) {
				year.selectedIndex = x;
			}
			x++;
		}
	}
}

function dynamicDay(month, day, year) {
	var dayLength = day.options.length;
	var sYear = year.options[year.selectedIndex].value;
	var val = month.options[month.selectedIndex].value;
	if(val == "feb") {
		var days = 28;
		if(isLeapYear(sYear)) {
			days = 29;
		}
		if(dayLength > days) {
			var diff = dayLength - days;
			for(var i = 1; i <= diff; i++) {
				day.remove(dayLength - i);
			}
		}
		else {
			var option = document.createElement("option");
			option.value = dayLength + 1;
			option.text = dayLength + 1;
			day.add(option);
		}
	}
	else {
		var days = 31;
		if((val == "apr") || (val == "jun") || (val == "sept") || (val == "nov")) {
			days = 30;
		}
		if(dayLength > days) {
			day.remove(dayLength - 1);
		}
		else {
			var diff = days - dayLength;
			for(var i = 1; i <= diff; i++) {
				var option = document.createElement("option");
				option.value = dayLength + i;
				option.text = dayLength + i;
				day.add(option);
			}
		}
	}
}

function isLeapYear(year) {
	if (((year % 4 == 0) && (year % 100 != 0)) || ((year % 4 == 0) && (year % 100 != 0) && (year % 400 == 0))) {
		return true;
	}
	else {
		return false;
	}
}

function getBirthDate() {
	var month = document.getElementById("monthBirth").value;
	var day = document.getElementById("dayBirth").value;
	var year = document.getElementById("yearBirth").value;
	var age = document.getElementById("studAge");
	age.value = calculateAge(month, day, year);
	// 
	// for LRN
	//
	if(document.getElementById("LRN") != null) { 
		if(age.value > 4) {
			document.getElementById('LRN').disabled = false;
		}
	}
}

function calculateAge(month, day, year) {
	var today = new Date();
	var age = today.getFullYear() - year;
	var m = today.getMonth() - month;
	if (m < 0 || (m === 0 && today.getDate() < day)) {
		age--;
	}
	return age;
}

function informationHeader(parent, arrayColumn, arrayText) {
	var row = document.createElement('div');
	row.classList.add("row");
	for(var i = 0; i < arrayColumn.length; i++) {
		var div = document.createElement('div');
		div.classList.add(arrayColumn[i]);
		var label = document.createElement('label');
		label.appendChild(document.createTextNode(arrayText[i]));
		div.appendChild(label);
		row.appendChild(div);
	}
	parent.appendChild(row);
}

// 
// Still need to remove the elements if the number of siblings enetered is incorrect
// 
function generateSiblings(siblings) {
	var siblinginfo = document.getElementById("siblinginformation");
	var div = document.getElementById('siblingDiv');
	if(div != null) {
		siblinginfo.removeChild(div);
	}
	// var siblings = parseInt(document.getElementById("siblings").value);
	var parentDiv = document.createElement('div');
	parentDiv.setAttribute("id", "siblingDiv");
	var columns = [ "column-30", "column-10", "column-10", "column-50" ];
	var arrayText = [ "Name of Sibling", "Gender", "Age", "School" ];
	if((!isNaN(siblings)) && (siblings > 0)) {
		informationHeader(parentDiv, columns, arrayText);
		for(var i = 0; i < siblings; i++) {
			var row = document.createElement('div');
			row.classList.add("row");
			for(var x = 0; x < columns.length; x++) {
				var div = document.createElement('div');
				div.classList.add(columns[x]);
				var input;
				if(x == 1) {
					input = document.createElement('select');
					var option1 = document.createElement('option');
					option1.text = "Male";
					input.add(option1);
					var option2 = document.createElement('option');
					option2.text = "Female";
					input.add(option2);
				}
				else {
					input = document.createElement('input');
					input.setAttribute("type", "text");
				}
				input.setAttribute("id", siblingText[x] + i);
				div.appendChild(input);
				row.appendChild(div);
			}
			parentDiv.appendChild(row);
		}
	}
	siblinginfo.appendChild(parentDiv);
	var sib = document.getElementById(siblingText[0] + 0);
	if(sib != null && sib.value == "") {
		sib.focus();
	}
}

function addSchool() {
	var prevSchoolCounter;
	var previousSchooling = document.getElementById('previousschooling');
	if(previousSchooling.hasChildNodes()) {
		prevSchoolCounter = previousSchooling.childNodes.length;
	}
	var prevSchool = document.createElement('div');
	prevSchool.classList.add('row');
	var columns = [ "column-15", "column-60", "column-25" ];
	for(var i = 0; i < columns.length; i++) {
		var div = document.createElement('div');
		div.classList.add(columns[i]);
		var input = document.createElement('input');
		input.setAttribute("type", "text");
		input.setAttribute("id", prevText[i] + prevSchoolCounter);
		div.appendChild(input);
		prevSchool.appendChild(div);
	}
	previousSchooling.insertBefore(prevSchool, previousSchooling.childNodes[0]);
}

function dlgCancel() {
	var white = document.getElementById("white-background");
	var dlg = document.getElementById("dlgbox");
	white.style.display = "none";
	dlg.style.display = "none";
}

function launchPopup() {
	var white = document.getElementById("white-background");
	var dlg = document.getElementById("dlgbox");
	white.style.display = "block";
	dlg.style.display = "block";
	var width = window.innerWidth;
	var height = window.innerHeight;
	dlg.style.left =(width/2) - 480/2 + "px";
	dlg.style.top = "150px";
}

function correctUpperForm(n) {
	var name = n.split(" ");
	var firstname = "";
	if(name.length > 1) {
		for(var i = 0; i < name.length; i++) {
			firstname += name[i].charAt(0).toUpperCase() + name[i].slice(1);
			firstname += " ";
		}
	}
	else {
		firstname = n.charAt(0).toUpperCase() + n.slice(1);
	}
	return firstname;
}

function checkUser(callback) {
	popupBox(function(status) {
		var rq = new XMLHttpRequest();
		rq.onreadystatechange = function() {
			if(rq.readyState == 4) {
				var response = JSON.parse(rq.responseText);
				callback(response);
			}
		};
		rq.open("POST", "/checkUser", true);
		rq.setRequestHeader("Content-Type", "application/json");
		rq.send(JSON.stringify({
			"username" : status.username,
			"password" : status.password
		}));
	});
}

function popupBox(callback) {
	var whitebg = document.createElement('div');
	whitebg.setAttribute("id", "white-background");
	var dialogBox = document.createElement('div');
	dialogBox.setAttribute("id", "dlgbox");
	var dialogHeader = document.createElement('div');
	dialogHeader.setAttribute("id", "dlgheader");
	dialogHeader.appendChild(document.createTextNode("Enter user details"));
	var dialogBody = document.createElement('div');
	dialogBody.setAttribute("id", "dlgbody");
	var userLabel = document.createElement('label');
	userLabel.appendChild(document.createTextNode("Username"));
	var userInput = document.createElement('input');
	userInput.setAttribute("type", "text");
	userInput.setAttribute("id", "username");
	var passLabel = document.createElement('label');
	passLabel.appendChild(document.createTextNode("Password"));
	var passInput = document.createElement('input');
	passInput.setAttribute("type", "password");
	passInput.setAttribute("id", "password");
	var dialogFooter = document.createElement('div');
	dialogFooter.setAttribute("id", "dlgfooter");
	var okButton = document.createElement('button');
	okButton.appendChild(document.createTextNode("Ok"));
	okButton.onclick = function() {
		var status = {
			"username" : document.getElementById("username").value,
			"password" : document.getElementById("password").value
		}
		callback(status);
	};
	var cancelButton = document.createElement('button');
	cancelButton.appendChild(document.createTextNode("Cancel"));
	cancelButton.onclick = function() {
		dlgCancel();
	};
	dialogBody.appendChild(userLabel);
	dialogBody.appendChild(userInput);
	dialogBody.appendChild(passLabel);
	dialogBody.appendChild(passInput);
	dialogFooter.appendChild(okButton);
	dialogFooter.appendChild(cancelButton);
	dialogBox.appendChild(dialogHeader);
	dialogBox.appendChild(dialogBody);
	dialogBox.appendChild(dialogFooter);
	var body = document.body;
	body.insertBefore(dialogBox, body.firstChild);
	body.insertBefore(whitebg, body.firstChild);
	launchPopup();
}

function checkStudentNumber(student) {
	if((student.value != "") && (!isNaN(student.value))) {
		let rq = new XMLHttpRequest();
		rq.onreadystatechange = function() {
			if(rq.readyState == 4) {
				var response = JSON.parse(rq.responseText);
				if(response.status == "error") {
					alert("Duplicate Student Number. Please input a new Student Number");
					student.value = "";
					student.focus();
				}
			}
		};
		rq.open("POST", "/checkStudentNumber", true);
		rq.setRequestHeader("Content-Type", "application/json");
		rq.send(JSON.stringify({
			studentNumber : student.value
		}));
	}
	else if(isNaN(student.value)) {
		alert("Please enter a valid Student Number");
		student.value = "";
		student.focus();
	}
}
