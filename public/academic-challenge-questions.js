var subjects;
var data;
var id;
var dd;

function init() {
	loadJSON(function(response) {
		data = response;
	})
}

function populateHeader(parentDiv) {
	var row = document.createElement('div');
	row.classList.add("row");
	subjects = [ "MATH", "SCIENCE", "SIBIKA", "SPELLING" ];
	for(var i = 0; i < subjects.length; i++) {
		var sub = document.createElement('div');
		sub.classList.add("column-25-2");
		var label = document.createElement('label');
		label.appendChild(document.createTextNode(subjects[i]));
		sub.appendChild(label);
		row.appendChild(sub);
	}
	parentDiv.appendChild(row);
}

function populateQuestionBtn(parentDiv) {
	var row = document.createElement('div');
	row.classList.add("row");
	for(var y = 1; y <= 6; y++) {
		for(var x = 0; x < subjects.length; x++) {
			var questions = document.createElement('div');
			questions.classList.add("column-25-2");
			var button = document.createElement("button");
			button.classList.add("acabtn");
			if(y >= 6) {
				button.setAttribute("id", trim(subjects[x]) + "CLINCHER");
				button.appendChild(document.createTextNode("CLINCHER"));
			}
			else {
				button.setAttribute("id", trim(subjects[x]) + y);
				button.appendChild(document.createTextNode(y));
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

function postToJSON(callback) {
	var div = document.getElementById("gradeSelect");
	var d = {};
	d.level = div.options[div.selectedIndex].value.trim();
	d.subject = id;
	d.question = document.getElementById("ques").value;
	d.choicea = document.getElementById("choicea").value;
	d.choiceb = document.getElementById("choiceb").value;
	d.choicec = document.getElementById("choicec").value;
	d.answer = document.getElementById("answer").value;
	var json = JSON.stringify(d);
	var rq = new XMLHttpRequest();
	rq.overrideMimeType("application/json");
	rq.open('POST', 'questions.json', true);
	rq.onreadystatechange = function () {
		if (rq.readyState == 4 && rq.status == 200) {
			callback(JSON.parse(rq.responseText));
		}
	};
	rq.send(json);
}

function openNav(buttonId) {
	id = buttonId;
	var btn = document.getElementById(buttonId);
	btn.disabled = true;
	btn.classList.remove("acabtn");
	btn.classList.add("disabledacabtn");
	// For the questions and choices
	var div = document.getElementById("gradeSelect");
	var grade = div.options[div.selectedIndex].value.trim();
	var header = document.getElementById("questionHeader");
	while(header.hasChildNodes()) {
		var l = header.childNodes;
		for(var i = 0; i < l.length; i++) {
			header.removeChild(header.childNodes[i]);
		}
	}
	var pHeader = document.createElement("p");
	var str1, str2;
	if(buttonId.includes("CLINCHER")) {
		str1 = buttonId.slice(0, -8) + " " + buttonId.slice(buttonId.length-8, buttonId.length);
		str2 = "1000";
	}
	else {
		str1 = buttonId.slice(0, -3);
		str2 = buttonId.slice(buttonId.length-3, buttonId.length);
	}
	pHeader.innerHTML = str1 + " for " + str2 + " points";
	header.appendChild(pHeader);
	for(x in data) {
		if(data[x].level == grade) {
			if(data[x].subject == buttonId) {
				var content = document.getElementById("overlay-content");
				var contentDiv = document.createElement("div");
				contentDiv.setAttribute("id", "contentDiv");
				// For the question elements
				var qlabel = document.createElement("label");
				qlabel.appendChild(document.createTextNode("Question:"));
				var question = document.createElement("input");
				question.classList.add("questions");
				question.setAttribute("id", "ques");
				question.setAttribute("size", 75);
				// For the choices elements
				var choiceslabel = document.createElement("label");
				choiceslabel.appendChild(document.createTextNode("Choices:"));
				var divChoices = document.createElement("div");
				divChoices.classList.add("questions")
				// For the answer elements
				var alabel = document.createElement("label");
				alabel.appendChild(document.createTextNode("Answer:"));
				var ans = document.createElement("input");
				ans.classList.add("questions");
				ans.setAttribute("id", "answer");
				ans.setAttribute("size", 50);
				while(content.hasChildNodes()) {
					var list = content.childNodes;
					for(var i = 0; i < list.length; i++) {
						content.removeChild(content.childNodes[i]);
					}
				}
				question.value = data[x].question;
				for(c in data[x].choices) {
					var str = "choice" + c;
					var choice = document.createElement("input");
					choice.classList.add("imageFile");
					choice.setAttribute("id", str);
					choice.setAttribute("size", 30)
					choice.value = data[x].choices[c];
					divChoices.appendChild(choice);
				}
				ans.value = data[x].answer;
				contentDiv.appendChild(qlabel);
				contentDiv.appendChild(question);
				contentDiv.appendChild(choiceslabel);
				contentDiv.appendChild(divChoices);
				contentDiv.appendChild(alabel);
				contentDiv.appendChild(ans);
				content.appendChild(contentDiv);
			}
		}
	}
	document.getElementById("myNav").style.height = "100%";
}


function loadFile(divId, inputId) {
	var submit = document.getElementById("close");
	submit.style.bottom = "85%";
	var reader = new FileReader();
	reader.onload = function() {
		var div = document.getElementById(divId);
		var input = document.getElementById(inputId);
		var img = document.createElement("img");
		img.classList.add("images");
		img.width = 150;
		img.height = 120;
		img.src = reader.result;
		div.appendChild(img);
		input.style.display = "none";
	};
	reader.readAsDataURL(event.target.files[0]);
}

/* Close */
function submit() {
	postToJSON(function(res) {
		dd = res;
	});
	document.getElementById("myNav").style.height = "0%";
}

// function openNav(buttonId) {
// 	id = buttonId;
// 	var header = document.getElementById("questionHeader");
// 	while(header.hasChildNodes()) {
// 		var list = header.childNodes;
// 		for(var i = 0; i < list.length; i++) {
// 			header.removeChild(header.childNodes[i]);
// 		}
// 	}
// 	var pHeader = document.createElement("p");
// 	var str1 = buttonId.slice(0, -3);
// 	var str2 = buttonId.slice(buttonId.length - 3, buttonId.length);
// 	pHeader.innerHTML = str1 + " for " + str2 + " points";
// 	header.appendChild(pHeader);
// 	var content = document.getElementById("overlay-content");
// 	while(content.hasChildNodes()) {
// 		var list = content.childNodes;
// 		for(var i = 0; i < list.length; i++) {
// 			content.removeChild(content.childNodes[i]);
// 		}
// 	}
// 	// For the question
// 	var qlabel = document.createElement("label");
// 	qlabel.appendChild(document.createTextNode("Question:"));
// 	var question = document.createElement("input");
// 	question.classList.add("questions");
// 	question.setAttribute("id", "ques");
// 	question.setAttribute("size", 75);
// 	// Choices label
// 	var choicesLabel = document.createElement("label");
// 	choicesLabel.appendChild(document.createTextNode("Choices:"));
// 	// For choice a and input a
// 	var div1 = document.createElement("div");
// 	div1.setAttribute("id", "div1");
// 	div1.classList.add("questions");
// 	var choicea = document.createElement("input");
// 	choicea.classList.add("imageFile");
// 	choicea.setAttribute("id", "choicea");
// 	choicea.setAttribute("size", 30);
// 	// var inputa = document.createElement("input");
// 	// inputa.setAttribute("id", "inputa");
// 	// inputa.classList.add("inputFile");
// 	// inputa.setAttribute("type", "file");
// 	// inputa.setAttribute("accept", "image/*");
// 	// var id1 = "div1";
// 	// var int1 = "choicea";
// 	// inputa.setAttribute("onchange", "loadFile(\"" + id1 + "\", \"" + int1 + "\")");
// 	div1.appendChild(choicea);
// 	// div1.appendChild(inputa);
// 	// For choice b and input b
// 	var div2 = document.createElement("div");
// 	div2.classList.add("questions");
// 	div2.setAttribute("id", "div2");
// 	var choiceb = document.createElement("input");
// 	choiceb.classList.add("imageFile");
// 	choiceb.setAttribute("id", "choiceb");
// 	choiceb.setAttribute("size", 30);
// 	// var inputb = document.createElement("input");
// 	// inputb.classList.add("inputFile");
// 	// inputb.setAttribute("type", "file");
// 	// inputb.setAttribute("accept", "image/*");
// 	// var id2 = "div2";
// 	// var int2 = "choiceb";
// 	// inputb.setAttribute("onchange", "loadFile(\"" + id2 + "\", \"" + int2 + "\")");
// 	div2.appendChild(choiceb);
// 	// div2.appendChild(inputb);
// 	// For choice c and input c
// 	var div3 = document.createElement("div");
// 	div3.classList.add("questions");
// 	div3.setAttribute("id", "div3");
// 	var choicec = document.createElement("input");
// 	choicec.classList.add("imageFile");
// 	choicec.setAttribute("id", "choicec");
// 	choicec.setAttribute("size", 30);
// 	// var inputc = document.createElement("input");
// 	// inputc.classList.add("inputFile");
// 	// inputc.setAttribute("type", "file");
// 	// inputc.setAttribute("accept", "image/*");
// 	// var id3 = "div3";
// 	// var int3 = "choicec";
// 	// inputc.setAttribute("onchange", "loadFile(\"" + id3 + "\", \"" + int3 + "\")");
// 	div3.appendChild(choicec);
// 	// div3.appendChild(inputc);
// 	// For the answer
// 	var alabel = document.createElement("label");
// 	alabel.appendChild(document.createTextNode("Answer:"));
// 	var answer = document.createElement("input");
// 	answer.classList.add("questions");
// 	answer.setAttribute("id", "answer");
// 	answer.setAttribute("size", 50);
// 	content.appendChild(qlabel);
// 	content.appendChild(question);
// 	content.appendChild(choicesLabel)
// 	content.appendChild(div1);
// 	content.appendChild(div2);
// 	content.appendChild(div3);
// 	content.appendChild(alabel);
// 	content.appendChild(answer);
// 	document.getElementById("myNav").style.height = "100%";
// }