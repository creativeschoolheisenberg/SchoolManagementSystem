function dropDownMenu(divId) {
	var payments = 69;
	var div = document.getElementById(divId);
	if((divId == "Nursery") || (divId == "Jr. Prep") || (divId == "Sr. Prep")) {
		payments = 68;
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
}

function enableBtn() {
	var div = document.getElementsByClassName('row');
	for(var i = 0; i < div.length; i++) {
		var children = div[i].children;
		for(var x = 0; x < children.length; x++) {
			var input = children[x].getElementsByTagName('input');
			for(var y = 0; y < input.length; y++) {
				if((input[y].id != 'tuition') && (input[y].id != 'miscellaneous') && (input[y].id != 'others') && (input[y].id != 'total')) {
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

function updateFees() {
	let rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			window.location.href="/accounting/fees";
			alert("Saved");
		}
	};
	rq.open("POST", "/updateFees", true);	
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
		booksNotebooksFee : document.getElementById('books').value,
		totalFee : document.getElementById('total').value
	}));
}

// This is used for updating the fees per payment plan

// function updateFees() {
// 	let rq = new XMLHttpRequest();
// 	rq.onreadystatechange = function() {
// 		if(rq.readyState == 4) {
// 			window.location.href="/accounting/fees";
// 			alert("Saved");
// 		}
// 	};
// 	rq.open("PUT", "/updateFees", true);	
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
// 		booksNotebooksFee : document.getElementById('books').value,
// 		totalFee : document.getElementById('total').value
// 	}));
// }

function totalFees() {
	var instruction = parseInt(document.getElementById('instruction').value);
	var mi = parseInt(document.getElementById('mi').value);
	var tuition = document.getElementById('tuition');
	tuition.value = instruction + mi;
	var regfee = parseInt(document.getElementById('regfee').value);
	var libfee = parseInt(document.getElementById('libfee').value);
	var athfee = parseInt(document.getElementById('athfee').value);
	var classmat = parseInt(document.getElementById('classmat').value);
	var comp = parseInt(document.getElementById('computer').value);
	var avr = parseInt(document.getElementById('avr').value);
	var medical = parseInt(document.getElementById('medical').value);
	var id = parseInt(document.getElementById('id').value);
	var insurance = parseInt(document.getElementById('insurance').value);
	var dev = parseInt(document.getElementById('development').value);
	var miscellaneous = document.getElementById('miscellaneous');
	miscellaneous.value = regfee + libfee + athfee + classmat + comp + avr + medical + id + insurance + dev;
	var energy = parseInt(document.getElementById('energy').value);
	var eductour = parseInt(document.getElementById('eductour').value);
	var program = parseInt(document.getElementById('schoolprog').value);
	var books = parseInt(document.getElementById('books').value);
	var other = document.getElementById('others');
	var paymentPlan = document.getElementById('installmentHeader').innerHTML;
	var plan = paymentPlan.split(" ");
	var o = energy + eductour + program;
	other.value = o;
	if(plan[0] !== "Grade") {
		o = o + books;
		other.value = o;
	}
	document.getElementById('total').value = parseInt(tuition.value) + parseInt(miscellaneous.value) + parseInt(other.value);
	document.getElementById('update').removeAttribute('disabled');
}

function trim(plan) {
	return plan.replace(/\s/g, "");
}

function showFees(plan) {
	let rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			document.getElementById('tuition').value = response.tuitionFee;
			document.getElementById('instruction').value = response.instructionalFee;
			document.getElementById('mi').value = response.miFee;
			document.getElementById('miscellaneous').value = response.miscellaneousFee;
			document.getElementById('regfee').value = response.registrationFee;
			document.getElementById('libfee').value = response.libraryFee;
			document.getElementById('athfee').value = response.athleticFee;
			document.getElementById('classmat').value = response.classroomMaterialsFee;
			document.getElementById('computer').value = response.computerInternetFee;
			document.getElementById('avr').value = response.audioVisualFee;
			document.getElementById('medical').value = response.medicalDentalFee;
			document.getElementById('id').value = response.idFee;
			document.getElementById('insurance').value = response.insuranceFee;
			document.getElementById('development').value = response.developmentMaintenanceFee;
			document.getElementById('others').value = response.otherFee;
			document.getElementById('energy').value = response.energyFee;
			document.getElementById('eductour').value = response.educationalTourFee;
			document.getElementById('schoolprog').value = response.schoolProgramsFee;
			document.getElementById('books').value = response.booksNotebooksFee;
			document.getElementById('total').value = response.totalFee;
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
