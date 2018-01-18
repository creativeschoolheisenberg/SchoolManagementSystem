function sendPostRequest(url) {
	var rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			document.getElementById('username').value = "";
			document.getElementById('password').value = "";
			if(url == "/login" && response.token != undefined) {
				localStorage.setItem("user", document.getElementById('username').value);
				localStorage.setItem("token", response.token);
				window.location.href="/index";
			}
		}
		else if(rq.responseText.toString() == "error") {
			document.getElementById('username').value = "";
			document.getElementById('password').value = "";
			alert("Error! Username password mismatch!");
		}
	};
	rq.open("POST", url, true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify({
		username : document.getElementById('username').value,
		password : document.getElementById('password').value
	}));
}

function logout(url) {
	var rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			if(url == "/logout" && response.message == "YES") {
				window.location.href="/thankyou";
				// localStorage.removeItem("user");
				// localStorage.removeItem("token");
			}
		}
	};
	rq.open("POST", url, true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify({
		mySession : localStorage.getItem("token")
	}));
}