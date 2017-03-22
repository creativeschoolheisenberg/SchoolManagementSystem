function sendPostRequest(url) {
	var rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			document.getElementById('username').value = "";
			document.getElementById('password').value = "";
			if(url == "/login" && response.token != undefined) {
				window.location.href = "/index?token=" + response.token;
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