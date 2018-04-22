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
			// make a checking here if the data has been
			// properly saved or not. Then we can redirect
			// to the intended page.
			var response = JSON.parse(rq.responseText);
			if(response.status == "ok") {
				window.location.href="/admission/pre-nursery-admission";
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
		"summerYear" : document.getElementById('schoolYear').value,
		"filename" :  lastname + firstname + ".img",
		"base64" : studentImage,
		"schedule" : document.getElementById('schedule').value,
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
		"contactNumber" : document.getElementById('contactnumber').value,
		"dateAdmitted" : date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear(),
		// document_info
		"birthCert" : document.getElementById('birthcert').checked,
		"registered" : document.getElementById('regfee').checked,
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
	rq.open("POST", "/addPre-Nursery", true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify(data));
}
