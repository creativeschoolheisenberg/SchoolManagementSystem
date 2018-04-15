var myPlan, payments;

function clearStudentInfo() {
	var studentInformation = document.getElementById('studentInformation');
	var input = studentInformation.getElementsByTagName('input');
	for(element in input) {
		if(input[element].value != "SEARCH") {
			input[element].value = "";
		}
	}
	document.getElementById('gradeLevel').value = "";
	document.getElementById('discountType').value = "";
	document.getElementById('discountType').disabled = false;
}

function clearInputs() {
	// clear radio buttons
	var form = document.myForm;
	var radio = form.plan;
	for(var i = 0; i < radio.length; i++) {
		if(radio[i].checked) {
			radio[i].checked = false;
		}
	}
	// clear text inputs of fees
	var fees = document.getElementById('fees');
	var input = fees.getElementsByTagName('input');
	for(element in input) {
		if(input[element].value === "compute") {
			input[element].disabled = false;
		}
		else {
			input[element].value = "";
		}
	}
	// remove books and notebooks for elementary
	if(document.getElementById('booksNotebooks').style.display == "block") {
		document.getElementById('booksNotebooks').style.display = "none";
	}
	// remove books and notebooks for preschool
	if(document.getElementById('preSchoolBooksNotebooks') != null) {
		var others = document.getElementById("otherFees");
		others.removeChild(document.getElementById('preSchoolBooksNotebooks'));
	}
}

function searchStudent() {
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
				if(response.gradeLevel === "Grade6") {
					alert("The record you are trying to enroll is not applicble anymore");
					var studentNumber = document.getElementById('studentNumber');
					var lastName = document.getElementById('lastName');
					var firstName = document.getElementById('firstName');
					studentNumber.value = "";
					lastName.value = "";
					firstName.value = "";
					studentNumber.focus();
				}
				else {
					for(res in response) {
						if(document.getElementById(res) != null) {
							document.getElementById(res).value = response[res];
						}
					}
					var schoolYear = document.getElementById('schoolYear').value;
					var sy = schoolYear.replace("-", "");
					document.getElementById('sy').value = schoolYear;
					var date = new Date();
					document.getElementById('dateEnrolled').value = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
					document.getElementById('registrationNumber').value = sy + document.getElementById('studentNumber').value;
					var studentNumber = document.getElementById('studentNumber').value;
					var gradeLevel = response.gradeLevel;
					var level = [ 
						"Nursery", "Jr.Prep", "Sr.Prep", 
						"Grade1", "Grade2", "Grade3", 
						"Grade4", "Grade5", "Grade6"
					];
					if(studentNumber.slice(0, 4) != date.getFullYear()) {
						for(var i = 0; i < level.length; i++) {
							if(response.gradeLevel === level[i]) {
								i++;
								gradeLevel = level[i];
								document.getElementById('gradeLevel').value = level[i];
							}
						}
					}
					createBooksElement(gradeLevel);
				}
			}
		}
	};
	rq.open("POST", "/searchStudent", true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify(data));
}

function enrolCreativeStudent() {
	let rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			if(response == null) {
				window.location.href="/accounting/enrolment";
				alert("Saved");
			}
			else if(response != null){
				var studentNumber = document.getElementById('studentNumber');
				alert("StudentNumber: " + studentNumber.value + " has already been enroled.");
				// something wrong with this one!!!
				clearStudentInfo();
				clearInputs();
				studentNumber.focus();
			}
		}
	};
	var data = {
		"studentNumber" : document.getElementById('studentNumber').value,
		"registrationNumber" : document.getElementById('registrationNumber').value,
		"schoolYear" : document.getElementById('sy').value,
		"dateEnroled" : document.getElementById('dateEnrolled').value,
		"gradeLevel" : document.getElementById('gradeLevel'),
		"paymentPlan" : myPlan,
		"totalAmountDue" : document.getElementById('total').value,
		"tuitionFee" : document.getElementById('tuition').value,
		"miscellaneousFee" : document.getElementById('miscellaneous').value,
		"otherFee" : document.getElementById('others').value,
		"reservation" : document.getElementById('reservation').value,
		"voucher" : document.getElementById('voucher').value,
		"voucherSerial" : document.getElementById('voucherSerial').value,
		"discountType" : document.getElementById('discountType').value,
		"discount" : document.getElementById('discount').value,
		"uponEnrolment" : document.getElementById('uponEnrolment').value,
		"installmentFee" : document.getElementById('installment').value,
		"payments" : payments,
		"totalBalance" : document.getElementById('total').value,
		"booksNotebooks" : document.getElementById('booksNotebooksElem').value,
		"booksNotebooksBalance" : document.getElementById('booksNotebooksElem').value
	};
	rq.open("POST", "/enrolCreativeStudent", true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify(data));
}

function showFees(plan) {
	myPlan = trim(plan);
	document.getElementById('discount').value = "";
	var paymentPlan = document.getElementById("gradeLevel").value + myPlan;
	var data = {
		"paymentPlan" : paymentPlan
	}
	let rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			for(val in response) {
				if(document.getElementById(val) != null) {
					document.getElementById(val).value = response[val];
				}
			}
			payments = response.payments;
			var insFee = document.getElementById('installmentFee');
			insFee.style.display = "block";
			if(document.getElementById('installment').value <= 0 ) {
				insFee.style.display = "none";
			}
		}
	};
	rq.open("POST", "/showFees", true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify(data));
}

function createBooksElement(gradeLevel) {
	if(gradeLevel === "Nursery" || gradeLevel === "Jr.Prep" || gradeLevel == "Sr.Prep") {
		document.getElementById("plane").disabled = true;
		var others = document.getElementById("otherFees");
		var div1 = document.createElement('div');
		div1.setAttribute("id", "preSchoolBooksNotebooks");
		div1.classList.add("row");
		var div2 = document.createElement('div');
		div2.classList.add("column-20");
		var div3 = document.createElement('div');
		div3.classList.add("column-30-2");
		var label = document.createElement('label');
		label.appendChild(document.createTextNode("Books and Notebooks"));
		div3.appendChild(label);
		div1.appendChild(div2);
		div1.appendChild(div3);
		others.appendChild(div1);
		
	}
	else {
		document.getElementById("plane").disabled = false;
		var books = document.getElementById("booksNotebooks");
		books.style.display = "block";
	}
}

function compute() {
	var reservation = document.getElementById('reservation');
	if(reservation.value === "") {
		reservation.value = 0;
	}
	var voucher = document.getElementById('voucher');
	if(voucher.value === "") {
		voucher.value = 0;
		document.getElementById('voucherSerial').value = "";
	}
	var discount = document.getElementById('discount');
	discount.value = computeDiscount();
	var ue = document.getElementById('uponEnrolment').value;
	var less = parseInt(reservation.value) + parseInt(voucher.value) + parseInt(discount.value);
	var newUE = ue - less;
	document.getElementById('uponEnrolment').value = newUE;
	document.getElementById('discountButton').disabled = true;
	reservation.disabled = true;
	voucher.disabled = true;
	document.getElementById('voucherSerial').disabled = true;
	document.getElementById('enrol').disabled = false; 
}

function computeDiscount() {
	var gradeLevel = document.getElementById('gradeLevel').value;
	var sibling = document.getElementById('discountType');
	var misc = document.getElementById('miscellaneous').value;
	var element = 0;
	// 
	// Get the family name of the student
	// Then also get the name of the parents
	// If the name of the parents match then they are siblings.
	// To apply discount check it the first child has already enrolled.
	// 
	if(sibling.value === "sibling") {
		var sibling = prompt("Pang ilang anak ka na naka enrol dito sa Creative?");
		if(myPlan === "PlanD") {
			if(gradeLevel === "Nursery" || gradeLevel === "Jr.Prep" || gradeLevel === "Sr.Prep") {
				myPlan = "PlanE";
			}
		}
		element = siblingDiscount[myPlan](sibling, misc);
	}
	// 
	// Idea here is to check the name of the student in the referral section
	// when the referee has applied for admission.
	// Then check if the referee has already been enrolled.
	// 
	else if(sibling.value === "referral") {
		var referred = prompt("How many students were referred?");
		element = 500 * referred;
	}
	// Fix this eventually
	// Need to check the parent's name against the database
	// Of the school
	else if(sibling.value === "alumni") {
		element = misc * 0.20;
	}
	// 
	// This has something to do with the student number of the student
	// The only problem here is that if the student jumped from nursery - sr.prep
	// or jr.prep - grade1
	// 
	else if(sibling.value === "loyalty") {
		// var studentNumber = document.getElementById('studentNumber').value;
		// var date = new Date();
		// var stud = studentNumber.slice(0, 4);
		// alert(stud - date.getFullYear());
		alert("This is not yet implemented");
	}
	else if(sibling.value === "earlybird") {
		element = prompt("How much discount was computed?");
	}
	sibling.disabled = true;
	return element;
}

// function print(divElement) {
// 	var div = document.getElementById(divElement);
// 	var openWindow = window.open("", "title", "attributes");
// 	while(div.hasChildNodes()) {
// 		var list = div.childNodes;
// 		for(var i = 0; i < list.length; i++) {
// 			openWindow.document.write(div.childNodes[i].innerHTML);
// 		}
// 	}
// }
