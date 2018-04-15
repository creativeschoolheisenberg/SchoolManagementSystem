var subjects;
var data;
var timer;
var counter = 0;
var audio;

function init() {
	audio = document.getElementById("myAudio");
	loadJSON(function(response) {
		data = response;
	});
}

function populateHeader(parentDiv) {
	var row = document.createElement('div');
	row.classList.add("row");
	subjects = [ "MATH", "SCIENCE", "SIBIKA", "SPELLING" ];
	for(var i = 0; i < subjects.length; i++) {
		var sub = document.createElement('div');
		sub.classList.add("column-25-2");
		var img = document.createElement('img');
		img.width = 200;
		img.height = 45;
		img.src = "/images/" + subjects[i] + ".jpg";
		sub.appendChild(img);
		row.appendChild(sub);
	}
	parentDiv.appendChild(row);
}

function populateQuestionBtn(parentDiv) {
	var grade = document.getElementById("gradeSelect");
	grade.addEventListener('change', function() {
		var gameHeader = document.getElementById("gameHeader");
		var imageHeader = document.createElement("div");
		imageHeader.setAttribute("id", "imageLevel");
		var level = document.createElement("img");
		level.width = 200;
		level.height = 45;
		level.src = "/images/" + grade.options[grade.selectedIndex].value + ".jpg"
		imageHeader.appendChild(level);
		gameHeader.insertBefore(imageHeader, gameHeader.firstChild);
		grade.disabled = true;
	})
	var row = document.createElement('div');
	row.classList.add("row");
	for(var y = 1; y <= 6; y++) {
		for(var x = 0; x < subjects.length; x++) {
			var questions = document.createElement('div');
			questions.classList.add("column-25-2");
			var button = document.createElement("button");
			if(y >= 6) {
				button.classList.add("disabledacabtn");
				button.disabled = true;
				button.appendChild(document.createTextNode("CLINCHER"));
				button.setAttribute("id", trim(subjects[x]) + "CLINCHER");
			}
			else {
				button.classList.add("acabtn");
				button.appendChild(document.createTextNode(y));
				button.setAttribute("id", trim(subjects[x]) + y);
			}
			button.setAttribute("onclick", "openNav('" + button.id + "')");
			questions.appendChild(button);
			row.appendChild(questions);
		}
		parentDiv.appendChild(row);
	}
}

function trim(str) {
	return str.replace(/\s/g, "");
}

function loadJSON(callback) {   
	var rq = new XMLHttpRequest();
	rq.overrideMimeType("application/json");
	rq.open('GET', 'questions.json', true);
	rq.onreadystatechange = function () {
		if (rq.readyState == 4 && rq.status == 200) {
			callback(JSON.parse(rq.responseText));
		}
	};
	rq.send();  
}

function openNav(buttonId) {
	// For the questions and choices
	var div = document.getElementById("gradeSelect");
	var grade = div.options[div.selectedIndex].value.trim();
	if(grade != "") {
		var header = document.getElementById("questionHeader");
		var btn = document.getElementById(buttonId);
		btn.disabled = true;
		btn.classList.remove("acabtn");
		btn.classList.add("disabledacabtn");
		while(header.hasChildNodes()) {
			var l = header.childNodes;
			for(var i = 0; i < l.length; i++) {
				header.removeChild(header.childNodes[i]);
			}
		}
		var pHeader = document.createElement("p");
		var str1, str2;
		if(buttonId.includes("CLINCHER")) {
			str1 = buttonId.slice(0, -8);
			str2 = " CLINCHER";
		}
		else {
			str1 = buttonId.slice(0, -1);
			if((buttonId.includes("1")) || (buttonId.includes("2"))) {
				str2 = " for 1 point";
			}
			else if((buttonId.includes("3")) || (buttonId.includes("4"))) {
				str2 = " for 2 points";
			}
			else {
				str2 = " for 3 points";
			}
		}
		pHeader.innerHTML = str1 + str2;
		header.appendChild(pHeader);
		for(x in data) {
			if(data[x].level == grade) {
				if(data[x].subject == buttonId) {
					var subj = document.getElementById("overlay-content");
					var quest = document.createElement("p");
					var divChoices = document.createElement("div");
					divChoices.setAttribute("id", "choices");
					var divAns = document.createElement("div");
					divAns.setAttribute("id", "ans");
					while(subj.hasChildNodes()) {
						var list = subj.childNodes;
						for(var i = 0; i < list.length; i++) {
							subj.removeChild(subj.childNodes[i]);
						}
					}
					quest.appendChild(document.createTextNode(data[x].question));
					var imageDiv = document.createElement("div");
					if(data[x].image != "") {
						var addImage = document.createElement("img");
						addImage.src = "/images/" + data[x].image;
						imageDiv.appendChild(addImage);
					}
					for(c in data[x].choices) {
						var choice = document.createElement("p");
						choice.appendChild(document.createTextNode(data[x].choices[c]));
						divChoices.appendChild(choice);
						divChoices.style.display = "block";
					}
					// Get the answer here as well
					var ans = document.createElement("p");
					ans.setAttribute("id", "ans");
					ans.appendChild(document.createTextNode(data[x].answer));
					divAns.style.display = "none";
					divAns.appendChild(ans);
					subj.appendChild(quest);
					subj.appendChild(imageDiv);
					subj.appendChild(divChoices);
					subj.appendChild(divAns);
				}
			}
		}
		// For the timer
		var element = document.getElementById("countdown");
		var seconds = 20;
		if((buttonId.includes("5")) || (buttonId.includes("CLINCHER"))) {
			seconds = 60;
		}
		else if((buttonId.includes("3")) || (buttonId.includes("4"))) {
			seconds = 30;
		}
		element.innerHTML = seconds + " seconds remaining";
		countdownTimer(seconds, element);
		// Make sure to set the attribute of the buttons inside the navigation screen
		var answer = document.getElementById("answerbtn");
		var closebtn = document.getElementById("close");
		closebtn.classList.remove("closebtn");
		closebtn.classList.add("disabledbtn");
		closebtn.disabled = true;
		answer.style.display = "none";
		element.style.display = "inline";
		document.getElementById("myNav").style.height = "100%";
	}
	else {
		alert("SELECT GRADE LEVEL FIRST");
	}
}

/* Close */
function closeNav() {
	document.getElementById("myNav").style.height = "0%";
	audio.load();
	enableClincher();
}

function countdownTimer(seconds, element) {
	timer = setInterval(function(){
		if(seconds <= 0) {
			audio.play();
			element.innerHTML = "Time's up!";
			clearInterval(timer);
		}
		else {
			element.innerHTML = seconds + " seconds remaining";
			seconds--;
		}
	},1000);
}

function stopTimer() {
	audio.play();
	clearInterval(timer);
	var timerbtn = document.getElementById("countdown");
	timerbtn.style.display = "none";
	var answer = document.getElementById("answerbtn");
	answer.style.display = "inline";
}

function showAnswer() {
	var sec = 2;
	var choices = document.getElementById("choices");
	choices.style.display = "none";
	var ans = document.getElementById("ans");
	ans.style.display = "block";
	var s = setInterval(function() {
		if(sec <= 0 ) {
			var closebtn = document.getElementById("close");
			closebtn.classList.remove("disabledbtn");
			closebtn.classList.add("closebtn");
			closebtn.disabled = false;
			clearInterval(s);
		}
		else {
			sec--;
		}
	}, 100);
}

function enableClincher() {
	var x = document.querySelectorAll("button.acabtn");
	var y = document.querySelectorAll("button.disabledacabtn");
	if((x.length <= 0) && counter == 0) {
		counter = 1;
		var clincher = document.querySelectorAll("[id*='CLINCHER']");
		for(var i = 0; i < clincher.length; i++) {
			var cl = document.getElementById(clincher[i].id)
			cl.classList.remove("disabledacabtn");
			cl.classList.add("acabtn");
			cl.disabled = false;
		}
	}
	else if(y.length >= 24){
		location.reload();
		// Add a page or something that say's challenge is over!
		// CONGRATULATIONS TO EVERYBODY WHO PARTICIPATED IN THIS
		// ACADEMIC CHALLENGE! WIN OR LOOSE KEEP UP THE GOOD WORK!	
	}
}
