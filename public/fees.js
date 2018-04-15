function dropDownMenu(divId) {
	var payments = 69;
	var div = document.getElementById(divId);
	if((divId == "Nursery") || (divId == "Jr. Prep") || (divId == "Sr. Prep")) {
		payments = 68;
		document.getElementById('booksNotebooksFee').style.display = "none";
		document.getElementById('miFee').style.display = "none";
		document.getElementById('compFee').style.display = "none";
		document.getElementById('preSchoolBooks').style.display = "block";
		document.getElementById("laboratory").style.display = "none";
	}
	else if(divId.includes("Grade")) {
		document.getElementById('booksNotebooksFee').style.display = "block";
		document.getElementById('preSchoolBooks').style.display = "none";
		document.getElementById('miFee').style.display = "block";
		document.getElementById('compFee').style.display = "block";
		document.getElementById("laboratory").style.display = "none";
		if(divId == "Grade 4" || divId == "Grade 5" || divId == "Grade 6") {
			document.getElementById("laboratory").style.display = "block";
		}
	}
	div.classList.toggle("show");
	//remove the children of the div first
	while(div.hasChildNodes()) {
		var list = div.childNodes;
		for(var i = 0; i < list.length; i++) {
			div.removeChild(div.childNodes[i]);
		}
	}
	var dropdowns = document.getElementsByClassName("dropdown-content");
	var i;
	for (i = 0; i < dropdowns.length; i++) {
		var openDropdown = dropdowns[i];
		if ((openDropdown.classList.contains('show')) && (openDropdown.id !== divId)) {
			openDropdown.classList.remove('show');
		}
	}
	for(var i = 65; i <= payments; i++) {
		var mop = document.createElement("a");
		var t = document.createTextNode("Plan " + String.fromCharCode(i));
		mop.appendChild(t);
		mop.setAttribute("onclick", "feesContainer('" + divId + "', 'Plan " + String.fromCharCode(i) + "')");
		div.appendChild(mop);
	}
}

function feesContainer(level, mop) {
	document.getElementById("installmentHeader").innerHTML = level + " " + mop;
	showFees(trim(document.getElementById("installmentHeader").innerHTML));
	payments(level, mop);
}

function enableBtn() {
	var div = document.getElementsByClassName('row');
	for(var i = 0; i < div.length; i++) {
		var children = div[i].children;
		for(var x = 0; x < children.length; x++) {
			var input = children[x].getElementsByTagName('input');
			for(var y = 0; y < input.length; y++) {
				if((input[y].id != 'tuition') && (input[y].id != 'miscellaneous') && (input[y].id != 'others') && (input[y].id != 'total') && (input[y].id != 'uponEnrolment')
					&& (input[y].id != 'installment') && (input[y].id != 'payments') && (input[y].id != "booksNotebooksElem")) {
					input[y].removeAttribute('disabled');
				}
			}
		}
	}
	document.getElementById('content').scrollTo(0, 0);
	document.getElementById("compute").removeAttribute('disabled');
}

// This is used for creating the first record per payment plan
// If this one needs to be implemented together with PUT
// We just need to create another button that would hold this function

// function updateFees() {
// 	let rq = new XMLHttpRequest();
// 	rq.onreadystatechange = function() {
// 		if(rq.readyState == 4) {
// 			var response = JSON.parse(rq.responseText);
// 			if(response == null) {
// 				window.location.href="/accounting/fees";
// 				alert(document.getElementById("installmentHeader").innerHTML + " Saved");
// 			}
// 		}
// 	};
// 	rq.open("POST", "/updateFees", true);	
// 	rq.setRequestHeader("Content-Type", "application/json");
// 	rq.send(JSON.stringify({
// 		paymentPlan : trim(document.getElementById('installmentHeader').innerHTML),
// 		tuitionFee : document.getElementById('tuition').value,
// 		instructionalFee : document.getElementById('instruction').value,
// 		miFee : document.getElementById('mi').value,
// 		miscellaneousFee : document.getElementById('miscellaneous').value,
// 		registrationFee : document.getElementById('regfee').value,
// 		libraryFee : document.getElementById('libfee').value,
// 		athleticFee : document.getElementById('athfee').value,
// 		labFee : document.getElementById('labfee').value,
// 		classroomMaterialsFee : document.getElementById('classmat').value,
// 		computerInternetFee : document.getElementById('computer').value,
// 		audioVisualFee : document.getElementById('avr').value,
// 		medicalDentalFee : document.getElementById('medical').value,
// 		idFee : document.getElementById('id').value,
// 		insuranceFee : document.getElementById('insurance').value,
// 		developmentMaintenanceFee : document.getElementById('development').value,
// 		otherFee : document.getElementById('others').value,
// 		energyFee : document.getElementById('energy').value,
// 		educationalTourFee : document.getElementById('eductour').value,
// 		schoolProgramsFee : document.getElementById('schoolprog').value,
// 		preSchoolBooks : document.getElementById('preBooks').value,
// 		booksNotebooks : document.getElementById('booksNotebooksElem').value,
// 		books : document.getElementById('books').value,
// 		notebooks : document.getElementById('notebooks').value,
// 		totalFee : document.getElementById('total').value,
// 		uponEnrolment : document.getElementById('uponEnrolment').value,
// 		installmentFee : document.getElementById('installment').value,
// 		payments : document.getElementById('payments').value
// 	}));
// }

// This is used for updating the fees per payment plan

function updateFees() {
	let rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			if(response == null) {
				window.location.href="/accounting/fees";
				alert(document.getElementById("installmentHeader").innerHTML + " Updated");
			}
		}
	};
	rq.open("PUT", "/updateFees", true);	
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify({
		paymentPlan : trim(document.getElementById('installmentHeader').innerHTML),
		tuitionFee : document.getElementById('tuition').value,
		instructionalFee : document.getElementById('instruction').value,
		miFee : document.getElementById('mi').value,
		miscellaneousFee : document.getElementById('miscellaneous').value,
		registrationFee : document.getElementById('regfee').value,
		libraryFee : document.getElementById('libfee').value,
		athleticFee : document.getElementById('athfee').value,
		labFee : document.getElementById('labfee').value,
		classroomMaterialsFee : document.getElementById('classmat').value,
		computerInternetFee : document.getElementById('computer').value,
		audioVisualFee : document.getElementById('avr').value,
		medicalDentalFee : document.getElementById('medical').value,
		idFee : document.getElementById('id').value,
		insuranceFee : document.getElementById('insurance').value,
		developmentMaintenanceFee : document.getElementById('development').value,
		otherFee : document.getElementById('others').value,
		energyFee : document.getElementById('energy').value,
		educationalTourFee : document.getElementById('eductour').value,
		schoolProgramsFee : document.getElementById('schoolprog').value,
		preSchoolBooks : document.getElementById('preBooks').value,
		booksNotebooks : document.getElementById('booksNotebooksElem').value,
		books : document.getElementById('books').value,
		notebooks : document.getElementById('notebooks').value,
		totalFee : document.getElementById('total').value,
		uponEnrolment : document.getElementById('uponEnrolment').value,
		installmentFee : document.getElementById('installment').value,
		payments : document.getElementById('payments').value
	}));
}

function totalFees() {
	var instruction = parseFloat(document.getElementById('instruction').value);
	var mi = 0, comp = 0, books = 0, labfee = 0, internet = 0;
	if(document.getElementById('mi').value != "") {
		mi = parseFloat(document.getElementById('mi').value);
	}
	var tuition = document.getElementById('tuition');
	tuition.value = (instruction + mi).toFixed(2);
	var regfee = parseInt(document.getElementById('regfee').value);
	var libfee = parseInt(document.getElementById('libfee').value);
	var athfee = parseInt(document.getElementById('athfee').value);
	var classmat = parseInt(document.getElementById('classmat').value);
	if(document.getElementById('computer').value != "") {
		comp = parseInt(document.getElementById('computer').value);
		internet = 500;
	}
	if(document.getElementById('labfee').value != "") {
		labfee = parseInt(document.getElementById('labfee').value);
	}
	var avr = parseInt(document.getElementById('avr').value);
	var medical = parseInt(document.getElementById('medical').value);
	var id = parseInt(document.getElementById('id').value);
	var insurance = parseInt(document.getElementById('insurance').value);
	var dev = parseInt(document.getElementById('development').value);
	var miscellaneous = document.getElementById('miscellaneous');
	miscellaneous.value = (regfee + libfee + athfee + labfee + classmat + comp + avr + medical + id + insurance + dev).toFixed(2);
	var energy = parseInt(document.getElementById('energy').value);
	var eductour = parseInt(document.getElementById('eductour').value);
	if(document.getElementById('preBooks').value != "") {
		books = parseInt(document.getElementById('preBooks').value);
	}
	var program = parseInt(document.getElementById('schoolprog').value);
	var other = document.getElementById('others');
	if(document.getElementById('books').value != "") {
		document.getElementById('booksNotebooksElem').value = parseInt(document.getElementById('books').value) + parseInt(document.getElementById('notebooks').value);
	}
	var pay = document.getElementById('payments').value;
	var installment, ue;
	other.value = (energy + eductour + program + books).toFixed(2);
	document.getElementById('total').value = (parseFloat(tuition.value) + parseInt(miscellaneous.value) + parseInt(other.value)).toFixed(2);
	if(pay === "1") {
		ue = document.getElementById('total').value;
		installment = 0;
	}
	else {
		installment = ((parseFloat(tuition.value) + regfee + libfee + athfee + classmat + labfee + energy + internet) / pay).toFixed(2);
		ue = (parseFloat(installment) + (program + avr + medical + id + insurance + dev + eductour + books + comp - internet)).toFixed(2);
	}
	if(document.getElementById("feesLevel").value == "Nursery") {
		document.getElementById("payments").value = pay - 1;
		ue = (parseFloat(ue) + parseFloat(installment));
	}
	document.getElementById('installment').value = installment;
	document.getElementById('uponEnrolment').value = ue;
	document.getElementById('update').removeAttribute('disabled');
}

function payments(level, mop) {
	document.getElementById("feesLevel").value = ""
	var pay = 10;
	if(mop == "Plan A") {
		pay = 1;
	}
	else if(mop == "Plan B") {
		pay = 2;
	}
	else if(mop == "Plan C") {
		pay = 4;
	}
	else if(mop == "Plan D") {
		if(level == "Nursery") {
			document.getElementById("feesLevel").value = "Nursery";
		}
		else if(level != "Jr. Prep" && level != "Sr. Prep") {
			pay = 5;
		}
	}
	document.getElementById('payments').value = pay;
}

function showFees(plan) {
	let rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			if(response.status != "error") {
				for(val in response) {
					document.getElementById(val).value = response[val];
				}
			}
			else {
				alert("No record existing");
				enableBtn();
				document.getElementById('instruction').focus();
			}
			//alert("Retrieved");
		}
	};
	rq.open("POST", "/showFees", true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify({
		paymentPlan : plan
	}));
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
	if(!event.target.matches('.glbtn')) {
		var dropdowns = document.getElementsByClassName("dropdown-content");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}
