function enableBtn() {
	var div = document.getElementsByClassName('row');
	for(var i = 0; i < div.length; i++) {
		var children = div[i].children;
		for(var x = 0; x < children.length; x++) {
			var input = children[x].getElementsByTagName('input');
			for(var y = 0; y < input.length; y++) {
				input[y].removeAttribute('disabled');
			}
		}
	}
	document.getElementById("update").removeAttribute('disabled');
}

// function updateLCPAFees() {
// 	let rq = new XMLHttpRequest();
// 	rq.onreadystatechange = function() {
// 		if(rq.readyState == 4) {
// 			var response = JSON.parse(rq.responseText);
// 			if(response == null) {
// 				window.location.href="/performing-arts";
// 				alert("Saved");
// 			}
// 		}
// 	};
// 	rq.open("POST", "/updateLCPAFees", true);	
// 	rq.setRequestHeader("Content-Type", "application/json");
// 	rq.send(JSON.stringify({
// 		plan : "cash",
// 		registrationFee : document.getElementById('regfee').value,
// 		voice : document.getElementById('voice').value,
// 		drums : document.getElementById('drums').value,
// 		dance : document.getElementById('dance').value,
// 		piano1 : document.getElementById('piano1').value,
// 		piano2 : document.getElementById('piano2').value,
// 		painting : document.getElementById('painting').value,
// 		violin : document.getElementById('violin').value,
// 		guitar : document.getElementById('guitar').value,
// 		recitalFee : document.getElementById('recitalFee').value
// 	}));
// }

// This is used for updating the fees per payment plan

function updateLCPAFees() {
	let rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			if(response == null) {
				window.location.href="/performing-arts";
				alert("Updated");
			}
		}
	};
	rq.open("PUT", "/updateLCPAFees", true);	
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify({
		plan : "cash",
		registrationFee : document.getElementById('regfee').value,
		voice : document.getElementById('voice').value,
		drums : document.getElementById('drums').value,
		dance : document.getElementById('dance').value,
		piano1 : document.getElementById('piano1').value,
		piano2 : document.getElementById('piano2').value,
		painting : document.getElementById('painting').value,
		violin : document.getElementById('violin').value,
		guitar : document.getElementById('guitar').value,
		recitalFee : document.getElementById('recitalFee').value
	}));
}

function showLCPAFees() {
	let rq = new XMLHttpRequest();
	rq.onreadystatechange = function() {
		if(rq.readyState == 4) {
			var response = JSON.parse(rq.responseText);
			if(response.status != "error") {
				for(val in response) {
					document.getElementById(val).value = response[val];
				}
			}
		}
	};
	rq.open("POST", "/showLCPAFees", true);
	rq.setRequestHeader("Content-Type", "application/json");
	rq.send(JSON.stringify({
		plan : "cash"
	}));
}
