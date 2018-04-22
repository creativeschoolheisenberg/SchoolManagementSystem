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
				disableElements();
			}
		}
	};
	rq.open("POST", postMethod, true);
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

function disableElements() {
	// Still can't disable the elements inside the form
}