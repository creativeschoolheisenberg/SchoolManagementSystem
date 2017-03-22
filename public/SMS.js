/*window.onload = function() {
	registrationForm();
	searchStudent();
};*/

function registrationForm() {
	document.getElementById('submit').onclick = function() {
		let rq = new XMLHttpRequest();
		rq.onreadystatechange = function() {
			if(rq.readyState == 4) {
				window.location.href = "/accounting/registration";
				alert("Saved");
			}
		};
		rq.open("POST", "/addStudent", true);	
		rq.setRequestHeader("Content-Type", "application/json");
		rq.send(JSON.stringify({
			studNumber : document.getElementById('studNumber').value,
			lName : document.getElementById('lName').value,
			fName : document.getElementById('fName').value,
			mi : document.getElementById('mi').value,
			gradeLevel : document.getElementById('gradeLevel').value,
			gender : document.getElementById('gender').value,
			month : document.getElementById('monthBirth').value,
			day : document.getElementById('dayBirth').value,
			year : document.getElementById('yearBirth').value,
			placeBirth : document.getElementById('placeBirth').value,
			studAge : document.getElementById('studAge').value,
			address : document.getElementById('address').value,
			telNo : document.getElementById('telNo').value,
			mlName : document.getElementById('mlName').value,
			mfName : document.getElementById('mfName').value,
			mmi : document.getElementById('mmi').value,
			mOccupation : document.getElementById('mOccupation').value,
			mBusAdd : document.getElementById('mBusAdd').value,
			mTelNo : document.getElementById('mTelNo').value,
			mEmail : document.getElementById('mEmail').value,
			mCell : document.getElementById('mCell').value,
			flName : document.getElementById('flName').value,
			ffName : document.getElementById('ffName').value,
			fmi : document.getElementById('fmi').value,
			fOccupation : document.getElementById('fOccupation').value,
			fBusAdd : document.getElementById('fBusAdd').value,
			fTelNo : document.getElementById('fTelNo').value,
			fEmail : document.getElementById('fEmail').value,
			fCell : document.getElementById('fCell').value
		}));
	};
}

function searchStudent() {
	document.getElementById('searchStud').onclick = function() {
		let rq = new XMLHttpRequest();
		rq.onreadystatechange = function() {
			if(rq.readyState == 4) {
				var response = JSON.parse(rq.responseText);
				document.getElementById('studLastName').value = response.lastName;
				document.getElementById('studFirstName').value = response.firstName;
				document.getElementById('studMI').value = response.initials;
				document.getElementById('gradeLevel').value = response.level;
				//alert("Retrieved");
			}
		};
		rq.open("POST", "/searchStudent", true);
		rq.setRequestHeader("Content-Type", "application/json");
		rq.send(JSON.stringify({
			searchStudNumber : document.getElementById('searchStudNumber').value
		}));
	};
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
		document.getElementById("schoolYear").value = determineSchoolYear(month, year);
	}
	else if(divID == "registration") {
		fillDay(document.getElementById("dayBirth"));
		fillYear(document.getElementById("yearBirth"));
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
}

function fillDay(day) {
	if(day.options.length == 0) {
		var days = 31;
		for(var i = 1; i <= days; i++) {
			var option = document.createElement("option");
			option.value = i;
			option.text = i;
			day.add(option);
		}
	}
}

function fillYear(year) {
	if(year.options.length == 0) {
		var currentYear = new Date().getFullYear();
		for(var i = 15; i >= 0; i-- ) {
			var option = document.createElement("option");
			option.value = currentYear - i;
			option.text = currentYear - i;
			year.add(option);
		}
	}
}

function dynamicDay(month, day, year) {
	var dayLength = day.options.length;
	var sYear = year.options[year.selectedIndex].value;
	var value = month.options[month.selectedIndex].value;
	if(value == "feb") {
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
		if((value == "apr") || (value == "jun") || (value == "sept") || (value == "nov")) {
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
	var dateString = month + " " + day + ", " + year;
	document.getElementById("studAge").value = calculateAge(dateString); 
}

function calculateAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function determineSchoolYear(currentMonth, currentYear) {
	if(currentMonth >= 4) {
		return currentYear + "-" + (currentYear + 1);
	}
	else if(currentMonth <= 8) {
		return (currentYear - 1) + "-" + currentYear;
	}
}