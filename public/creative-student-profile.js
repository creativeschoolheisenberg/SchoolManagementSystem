function searchStudent(studentCategory) {
	var search = document.getElementById('searchLastName');
	var subSearch;
	var bool = false;
	var status = {};
	var postMethod;
	if(studentCategory == "creative") {
		search = document.getElementById('searchStudentNumber');
		if((search.value == "") && (isNaN(search.value))) {
			alert("Please enter a valid Student Number");
			search.value = "";
			search.focus();
		}
		else {
			bool = true;
			status = {
				"studentNumber" : search.value
			}
			postMethod = "/searchStudent"
		}
	}
	else {
		subSearch = document.getElementById('searchFirstName');
		if(search.value == "" || subSearch.value == "") {
			alert("You have to fill in both LastName and FirstName to search");
			lastName.focus();
		}
		else {
			bool = true;
			status = {
				"lastName" : search.value,
				"firstName" : subSearch.value
			}
			postMethod = "/searchPreNursery";
		}
	}
	if(bool == true) {
		submitSearch(status, postMethod);
	}
}

function submitSearch(value, postMethod) {
	var data = {};
	for(v in value) {
		data[v] = value[v];
	}
	let rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			if(response.status === "error") {
				alert("No Record Found. Please search again.");
				if(data["studentNumber"] != null) {
					document.getElementById("searchStudentNumber").value = "";
					document.getElementById("searchStudentNumber").focus();
				}
				else {
					document.getElementById("searchLastName").value = "";
					document.getElementById("searchFirstName").value = "";
					document.getElementById("searchLastName").focus();
				}
			}
			else {
				document.getElementById('searchContainer').style.display = "none";
				document.getElementById('searchContent').style.display = "block";
				for(res in response) {
					if(document.getElementById(res) != null) {
						document.getElementById(res).value = response[res];
						if(res == "imageData") {
							document.getElementById(res).src = response[res];
						}
						else if(res == "siblings") {
							if(response[res] > 0) {
								var siblings = response[res];
								generateSiblings(siblings);
							}
							else {
								document.getElementById('siblings').value = 0;
							}
						}
						else if(response[res] == 1) {
							document.getElementById(res).checked = true;
						}
						else if(res == "referrerName" || res == "relationship" || res == "otherMeans") {
							if(response[res] != "") {
								document.getElementById('referals').style.display = "block";
							}
						}
					}
					else if(res.includes("sibling")) {
						var i = 0;
						if(document.getElementById(res + i) != null) {
							var sibs = response[res].split("/");
							for(v in sibs) {
								document.getElementById(res + i).value = sibs[v];
								i++;
							}
						}
					}
					else if(res.includes("previous")) {
						var level = response[res].split("/")
						if(res == "previousGradeLevel" && response[res] != "") {
							generatePreviousSchooling(level.length);
						}
						var i = 1;
						if(document.getElementById(res + i) != null) {
							for(v in level) {
								document.getElementById(res + i).value = level[v];
								i++;
							}
						}
					}
				}
				var birth = response.dateOfBirth.split("/");
				document.getElementById('monthBirth').value = birth[0];
				document.getElementById('dayBirth').value = birth[1];
				document.getElementById('yearBirth').value = birth[2];
				document.getElementById('studentNumber').focus();
				stateOfElements(document.getElementById('myForm'), true);
			}
		}
	};
	rq.open("POST", postMethod, true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify(data));
}

function updateCreativeStudent() {
	let rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			if(response == null) {
				window.location.href="/profile/creative-student-profile";
				alert("Student Number: " + document.getElementById("studentNumber").innerHTML + " Updated");
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
		"schoolYear" : document.getElementById('schoolYear').value,
		"LRN" : document.getElementById('LRN').value,
		"filename" :  lastname + firstname + ".img",
		"base64" : studentImage,
		"lastName" : lastname,
		"firstName" : firstname,
		"middleName" : document.getElementById('middlename').value,
		"nickname" : document.getElementById('nickname').value,
		"gradeLevel" : document.getElementById('gradelevel').value,
		"gender" : document.getElementById('gender').value,
		"month" : document.getElementById('monthBirth').value,
		"day" : document.getElementById('dayBirth').value,
		"year" : document.getElementById('yearBirth').value,
		"placeBirth" : document.getElementById('placebirth').value,
		"address" : document.getElementById('address').value,
		"contactNumber" : document.getElementById('contactnumber').value,
		"dateAdmitted" : date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear(),
		// document_info
		"birthCert" : document.getElementById('birthcert').checked,
		"F138E" : document.getElementById('F138E').checked,
		"F137E" : document.getElementById('F137E').checked,
		// parent_info
		"momLastName" : document.getElementById('momlastname').value,
		"momFirstName" : document.getElementById('momfirstname').value,
		"momMiddleName" : document.getElementById('mommiddlename').value,
		"momOccupation" : document.getElementById('momoccupation').value,
		"momBusAdd" : document.getElementById('mombusadd').value,
		"momCellphone" : document.getElementById('momcellphone').value,
		"momEmailAdd" : document.getElementById('momemailadd').value,
		"popLastName" : document.getElementById('poplastname').value,
		"popFirstName" : document.getElementById('popfirstname').value,
		"popMiddleName" : document.getElementById('popmiddlename').value,
		"popOccupation" : document.getElementById('popoccupation').value,
		"popBusAdd" : document.getElementById('popbusadd').value,
		"popCellphone" : document.getElementById('popcellphone').value,
		"popEmailAdd" : document.getElementById('popemailadd').value,
		"referrerName" : document.getElementById('referrer').value,
		"relation" : document.getElementById('relation').value,
		"otherMeans" : document.getElementById('othermeans').value
	};
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
			siblingName += "/";
			siblingGender += "/";
			siblingAge += "/";
			siblingSchool += "/";
		}
		siblingNumber -= 1;
	}
	data["siblingName"] = siblingName;
	data["siblingGender"] = siblingGender;
	data["siblingAge"] = siblingAge;
	data["siblingSchool"] = siblingSchool;
	// previous_schooling_info
	var previousSchooling = document.getElementById('previousschooling');
	var prevSchoolCounter = previousSchooling.childNodes.length - 1;
	var prevLevel = "", prevSchool = "", prevYear = ""
	var count = prevSchoolCounter;
	for(var i = 1; i <= prevSchoolCounter; i++) {
		prevLevel += document.getElementById(prevText[0] + i).value;
		prevSchool += document.getElementById(prevText[1] + i).value;
		prevYear += document.getElementById(prevText[2] + i).value;
		if(count > 1) {
			prevLevel += "/";
			prevSchool += "/";
			prevYear += "/";
		}
		count -= 1;
	}
	data["prevLevel"] = prevLevel;
	data["prevSchool"] = prevSchool;
	data["prevYear"] = prevYear;
	rq.open("POST", "/updateCreativeStudent", true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify(data));
}

function generatePreviousSchooling(elements) {
	var previousSchooling = document.getElementById('previousschooling');
	var columns = [ "column-15", "column-60", "column-25" ];
	var arrayText = [ "previousGradeLevel", "previousSchoolName", "previousYear" ];
	while(elements > 0) {
		var row = document.createElement('div');
		row.classList.add("row");
		for(var x = 0; x < columns.length; x++) {
			var div = document.createElement('div');
			div.classList.add(columns[x]);
			var input = document.createElement('input');
			input.setAttribute("type", "text");
			input.setAttribute("id", arrayText[x] + elements);
			div.appendChild(input);
			row.appendChild(div);
		}
		previousSchooling.appendChild(row);
		elements--;
	}
}

function stateOfElements(form, state) {
	// Still can't disable the elements inside the form
    if(document.all || document.getElementById) {
        for(i = 0; i < form.length; i++) {
			var formElement = form.elements[i];
			formElement.disabled = state;
			if(!state && form.elements[i].id == "studentNumber") {
				document.getElementById(form.elements[i].id).disabled = true;
			}
        }
    }
}

function editProfile() {
	stateOfElements(document.getElementById('myForm'), false);
	document.getElementById("camera").disabled = false;
	document.getElementById('content').scrollTo(0, 0);
}
