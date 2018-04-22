function sendPostRequest(url) {
	var rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			document.getElementById('username').value = "";
			document.getElementById('password').value = "";
			if(url == "/login" && response.token != undefined) {
				localStorage.setItem("user", document.getElementById('username').value);
				localStorage.setItem("username", response.username);
				localStorage.setItem("token", response.token);
				if(response.account == "game") {
					window.location.href="/academic-challenge";
				}
				else {
					window.location.href="/index";
				}
			}
			else if(response.status === "error") {
				document.getElementById('username').value = "";
				document.getElementById('password').value = "";
				alert("Error! Username password mismatch!");
			}
		}
	};
	rq.open("POST", url, true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify({
		username : document.getElementById('username').value,
		password : document.getElementById('password').value
	}));
}

function signup(url) {
	var rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			if(response.status === "ok") {
				window.location.href="/";
				alert("Saved");
			}
		}
	};
	rq.open("POST", url, true);	
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify({
		username : document.getElementById('username').value,
		firstname : document.getElementById('firstname').value,
		lastname : document.getElementById('lastname').value,
		password : document.getElementById('password').value,
		accounttype : document.getElementById('accounttype').value
	}));
}
