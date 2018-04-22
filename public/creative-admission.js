var counter = 0;

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
				window.location.href="/admission/creative-admission";
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
		"studentNumber" : document.getElementById('studentnumber').value,
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
	rq.open("POST", "/addCreativeStudent", true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify(data));
}

function importInformation() {
	let rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			if(response.status === "error") {
				alert("The record you are searching is not yet existing");
			}
			else {
				document.getElementById("showPhoto").src = response.ImageData;
				document.getElementById('gradelevel').value = "Nursery";
				document.getElementById('lastname').value = response.LastName;
				document.getElementById('firstname').value = response.FirstName;
				document.getElementById('middlename').value = response.MiddleInitial;
				document.getElementById('nickname').value = response.Nickname;
				document.getElementById('gender').value = response.Gender;
				document.getElementById('placebirth').value = response.PlaceOfBirth;
				document.getElementById('address').value = response.Address;
				document.getElementById('contactnumber').value = response.ContactNumber;
				document.getElementById('momlastname').value = response.MotherLastName;
				document.getElementById('momfirstname').value = response.MotherFirstName;
				document.getElementById('mommiddlename').value = response.MotherMiddleInitial;
				document.getElementById('momoccupation').value = response.MotherOccupation;
				document.getElementById('mombusadd').value = response.MotherBusAdd;
				document.getElementById('momcellphone').value = response.MotherCell;
				document.getElementById('momemailadd').value = response.MotherEmail;
				document.getElementById('poplastname').value = response.FatherLastName;
				document.getElementById('popfirstname').value = response.FatherFirstName;
				document.getElementById('popmiddlename').value = response.FatherMiddleInitial;
				document.getElementById('popoccupation').value = response.FatherOccupation;
				document.getElementById('popbusadd').value = response.FatherBusAdd;
				document.getElementById('popcellphone').value = response.FatherCell;
				document.getElementById('popemailadd').value = response.FatherEmail;
				document.getElementById('siblings').value = response.NumberOfSiblings;
				generateSiblings(response.NumberOfSiblings);
				var birth = response.DateOfBirth.split("/");
				document.getElementById('monthBirth').value = birth[0];
				document.getElementById('dayBirth').value = birth[1];
				document.getElementById('yearBirth').value = birth[2];
				getBirthDate();
				if(response.BirthCertificate == 1) {
					document.getElementById('birthcert').checked = true;
				}
				var siblingNumber = document.getElementById('siblings').value;
				var siblingName = response.SiblingName.split("/");
				var siblingGender = response.SiblingGender.split("/");
				var siblingAge = response.SiblingAge.split("/");
				var siblingSchoolName = response.SiblingSchoolName.split("/");
				for(var i = 0; i < siblingNumber; i++) {
					document.getElementById(siblingText[0] + i).value = siblingName[i];
					document.getElementById(siblingText[1] + i).value = siblingGender[i];
					document.getElementById(siblingText[2] + i).value = siblingAge[i];
					document.getElementById(siblingText[3] + i).value = siblingSchoolName[i];
				}
				document.getElementById('referrer').value = response.ReferrerName;
				document.getElementById('relation').value = response.Relation;
				document.getElementById('othermeans').value = response.OtherMeans;
			}
			var white = document.getElementById("white-background");
			var dlg = document.getElementById("dlgbox");
			white.style.display = "none";
			dlg.style.display = "none";
			document.getElementById('lastname').focus();
		}
	};
	rq.open("POST", "/importPreNurseryInformation", true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify({
		"lastname" : document.getElementById('preNlastname').value,
		"firstname" : document.getElementById('preNfirstname').value
	}));
}
