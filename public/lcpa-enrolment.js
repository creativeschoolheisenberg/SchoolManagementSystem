function searchLCPAStudent() {
	if(document.getElementById('registrationNumber').value != "") {
		clearInputs();
	}
	var studentNumber = document.getElementById('studentNumber');
	var lastName = document.getElementById('lastName');
	var firstName = document.getElementById('firstName');
	if(studentNumber.value == "" && lastName.value == "" && firstName.value == "") {
		alert("Either enter the Student Number or fill in the Lastname and Firstname of the student");
	}
	else if(studentNumber.value != "") {
		var status = {
			"studentNumber" : studentNumber.value
		}
		submitSearch(status);
	}
	else {
		if(lastName.value != "" && firstName.value != "") {
			var status = {
				"lastName" : lastName.value,
				"firstName" : firstName.value
			}
			submitSearch(status);
		}
		else {
			if(lastName.value == "") {
				alert("If you have chosen to enter the Firstname of the student, the Lastname should also be entered");
				lastName.focus();
			}
			else {
				alert("If you have chosen to enter the Lastname of the student, the Firstname should also be entered");
				firstName.focus();
			}
		}
	}
}

function submitSearch(jsonValue) {
	var data = {};
	for(value in jsonValue) {
		data[value] = jsonValue[value]
	}
	let rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			if(response.status === "error") {
				alert("No Record Found. Please search again.");
				document.getElementById('studentNumber').value = "";
				document.getElementById('lastName').value = "";
				document.getElementById('firstName').value = "";
			}
			else {
				for(res in response) {
					if(document.getElementById(res) != null) {
						document.getElementById(res).value = response[res];
					}
				}
				var course = document.getElementById('course').value.split(",")
				computeCourse(course);
				var schoolYear = document.getElementById('schoolYear').value;
				var sy = schoolYear.replace("-", "");
				document.getElementById('sy').value = schoolYear;
				var date = new Date();
				document.getElementById('dateEnrolled').value = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
				document.getElementById('registrationNumber').value = sy + document.getElementById('studentNumber').value;
			}
			document.getElementById('discount').disabled = false;
		}
	};
	rq.open("POST", "/searchLCPAStudent", true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify(data));
}

function computeCourse(courses) {
	createCourseElements(courses);
	let rq = new XMLHttpRequest();
	var courseFee = 0;
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			for(val in response) {
				if(document.getElementById(val) != null) {
					document.getElementById(val).value = response[val];
				}
				for(course in courses) {
					if(val == courses[course].toLowerCase().trim()) {
						courseFee += response[val];
					}
				}
			}
			document.getElementById('totalCourseFee').value = courseFee;
			document.getElementById('total').value = courseFee + parseInt(document.getElementById('regfee').value) + parseInt(document.getElementById('recitalFee').value);
		}
	};
	rq.open("POST", "/showLCPAFees", true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify({
		plan : "cash"
	}));
}

function createCourseElements(courseArray) {
	var div = document.getElementById('courses');
	for(course in courseArray) {
		var row = document.createElement('div');
		row.classList.add('row');
		var col20 = document.createElement('div');
		col20.classList.add('column-20');
		var col30 = document.createElement('div');
		col30.classList.add('column-30-2');
		var label = document.createElement('label');
		label.appendChild(document.createTextNode(courseArray[course]));
		col30.appendChild(label);
		row.appendChild(col20);
		row.appendChild(col30);
		var col10 = document.createElement('div');
		col10.classList.add('column-10');
		var col202 = document.createElement('div');
		col202.classList.add('column-20');
		var input = document.createElement('input');
		input.setAttribute("type", "text");
		input.setAttribute("id", courseArray[course].toLowerCase().trim());
		input.disabled = true;
		col202.appendChild(input);
		row.appendChild(col10);
		row.appendChild(col202);
		div.appendChild(row);
	}
}

function compute() {
	var discount = document.getElementById('discount').value;
	var total = parseInt(document.getElementById('totalCourseFee').value) + parseInt(document.getElementById('regfee').value);
	document.getElementById('totalAmount').value = total - discount;
}
