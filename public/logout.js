function logout(url) {
	var rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			if(url == "/logout" && response.message == "YES") {
				window.location.href="/thankyou";
				localStorage.removeItem("user");
				localStorage.removeItem("token");
				localStorage.removeItem("username");
			}
		}
	};
	rq.open("POST", url, true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify({
		mySession : localStorage.getItem("token")
	}));
}

function determineSchoolYear(currentMonth, currentYear) {
	// FIXED THIS FOR NEXT SCHOOL YEAR
	var year = currentYear;
	return(year + "-" + parseInt(year + 1));
}