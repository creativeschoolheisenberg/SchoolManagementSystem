var courseCounter = 0;
var workshopCounter = 0;
var workshopID = [ "workshopattended", "workshoparea", "workshopyear" ];

function registration() {
	if(localStorage.getItem("username") === "student") {
		checkUser(function(status) {
			if(status.status === "ok") {
				saveData();
			}
			else {
				alert("Your account does not support this action. Contact your administrator!");
			}
		});
	}
	else {
		saveData();
	}
}

function saveData() {
	var date = new Date();
	let rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			if(response.status == "ok") {
				window.location.href="/admission/lcpa-admission";
				alert("Saved");
			}
		}
	};
	var studentImage;
	if(canvas == null) {
		studentImage = document.getElementById("showPhoto").src;
	}
	else {
		studentImage = canvas.toDataURL();
	}
	var lastname = correctUpperForm(document.getElementById('lastname').value);
	var firstname = correctUpperForm(document.getElementById('firstname').value);
	var data = {
		// student_info
		"LCPAYear" : document.getElementById("schoolYear").value,
		"filename" :  lastname + firstname + ".img",
		"base64" : studentImage,
		"lastName" : lastname,
		"firstName" : firstname,
		"middleName" : document.getElementById('middlename').value,
		"nickname" : document.getElementById('nickname').value,
		"gender" : document.getElementById('gender').value,
		"month" : document.getElementById('monthBirth').value,
		"day" : document.getElementById('dayBirth').value,
		"year" : document.getElementById('yearBirth').value,
		"placeBirth" : document.getElementById('placebirth').value,
		"address" : document.getElementById('address').value,
		"homeNumber" : document.getElementById('homenumber').value,
		"cellphoneNumber" : document.getElementById('cellphonenumber').value,
		"dateAdmitted" : date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear(),
		"referrerName" : document.getElementById('referrer').value,
		"relation" : document.getElementById('relation').value,
		"otherMeans" : document.getElementById('othermeans').value
	};
	// course_info
	var course = "", sched = "";
	var courseCount = courseCounter;
	for(var i = 0; i <= courseCounter; i++) {
		course += document.getElementById("course" + i).value;
		sched += document.getElementById("sched" + i).value;
		if(courseCount > 0) {
			course += ", ";
			sched += ", ";
		}
		courseCount -= 1;
	}
	data["course"] = course;
	data["sched"] = sched;
	// sibling_info
	var siblingNumber = document.getElementById('siblings').value;
	var siblingName = "", siblingGender = "", siblingAge = "", siblingSchool = "";
	data["siblings"] = siblingNumber;
	for(var i = 0; i < document.getElementById('siblings').value; i++) {
		siblingName += document.getElementById(siblingText[0] + i).value;
		siblingGender += document.getElementById(siblingText[1] + i).value;
		siblingAge += document.getElementById(siblingText[2] + i).value;
		siblingSchool += document.getElementById(siblingText[3] + i).value;
		if(siblingNumber > 1) {
			siblingName += ", ";
			siblingGender += ", ";
			siblingAge += ", ";
			siblingSchool += ", ";
		}
		siblingNumber -= 1;
	}
	data["siblingName"] = siblingName;
	data["siblingGender"] = siblingGender;
	data["siblingAge"] = siblingAge;
	data["siblingSchool"] = siblingSchool;
	// Workshop attended
	var workshopCount = workshopCounter;
	var workshop = "", workshopSchool = "", workshopYear = "";
	for(var i = 0; i <= workshopCounter; i++) {
		workshop += document.getElementById(workshopID[0] + i).value;
		workshopSchool += document.getElementById(workshopID[1] + i).value;
		workshopYear += document.getElementById(workshopID[2] + i).value;
		if(workshopCount > 0) {
			workshop += ", ";
			workshopSchool += ", ";
			workshopYear += ", ";
		}
		workshopCount -= 1;
	}
	data["workshop"] = workshop;
	data["workshopSchool"] = workshopSchool;
	data["workshopYear"] = workshopYear;
	rq.open("POST", "/addLCPAStudent", true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify(data));
}

function addCourse() {
	courseCounter++;
	var course = document.getElementById('coursediv');
	var newCourseDiv = document.createElement('div');
	newCourseDiv.classList.add("row");
	var columns = [ "column-15", "column-15", "column-15", "column-15-2", "column-15" ];
	var coursesOffered = [ "Voice", "Piano", "Guitar", "Drums", "Dance", "Visual Arts", "Violin" ];
	for(var i = 0; i < columns.length; i++) {
		var div = document.createElement('div');
		div.classList.add(columns[i]);
		if(i == 1) {
			var select = document.createElement('select');
			select.setAttribute("id", "course" + courseCounter);
			for(var x = 0; x < coursesOffered.length; x++) {
				var option = document.createElement('option');
				option.setAttribute("value", coursesOffered[x]);
				option.appendChild(document.createTextNode(coursesOffered[x]));
				select.appendChild(option);
			}
			div.appendChild(select);
		}
		if(i == 4) {
			var input = document.createElement('input');
			input.setAttribute("type", "text");
			input.setAttribute("id", "sched" + courseCounter);
			div.appendChild(input);
		}
		newCourseDiv.appendChild(div);
	}
	course.parentNode.insertBefore(newCourseDiv, course.nextSibling);
}

function addWorkshop() {
	workshopCounter++;
	var workshop = document.getElementById('workshop');
	var newWorkshop = document.createElement('div');
	newWorkshop.classList.add('row');
	var columns = [ "column-50", "column-30", "column-20" ];
	for(var i = 0; i < columns.length; i++) {
		var div = document.createElement('div');
		div.classList.add(columns[i]);
		var input = document.createElement('input');
		input.setAttribute("type", "text");
		input.setAttribute("id", workshopID[i] + workshopCounter);
		div.appendChild(input);
		newWorkshop.appendChild(div);
	}
	workshop.insertBefore(newWorkshop, workshop.childNodes[0]);
}
