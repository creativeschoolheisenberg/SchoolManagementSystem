var _streamCopy = null;
var img, video, canvas, camera, shoot, again;

function photograph() {
	var context = canvas.getContext('2d');
	context.drawImage(video, 0, 0, 150, 120);
	video.style.display = "none";
	canvas.style.display = "inline";
	shoot.style.display = "none";
	again.style.display = "inline";
	_streamCopy.getVideoTracks().forEach(track => track.stop());
}

function openCamera() {
	if(checkCamera()) {
		camera = document.getElementById("camera");
		camera.style.display = "none";
		canvas.style.display = "none";
		again.style.display = "none";
	}
	else {
		alert("error loading camera! Not supported!");
	}
}

function createElements() {
	var div = document.getElementById("photo");
	video = document.createElement("video");
	video.width = 150;
	video.height = 120;
	video.autoplay = true;
	canvas = document.createElement("canvas");
	canvas.width = 150;
	canvas.height = 120;
	div.appendChild(video);
	div.appendChild(canvas);
	var divButton = document.getElementById("photobtn");
	shoot = document.createElement("button");
	shoot.innerHTML = "TAKE PHOTO";
	shoot.setAttribute("onclick", "photograph()");
	again = document.createElement("button");
	again.innerHTML = "RETAKE";
	again.setAttribute("onclick", "retake()");
	divButton.appendChild(shoot);
	divButton.appendChild(again);
}

function retake() {
	var div = document.getElementById("photo");
	var divButton = document.getElementById("photobtn");
	div.removeChild(video);
	div.removeChild(canvas);
	divButton.removeChild(shoot);
	divButton.removeChild(again);
	camera.style.display = "inline";
}

function checkCamera() {
	var camera = false;
	var mediaConfig =  { video: true };
	// Put video listeners into place
	if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		camera = true;
		createElements();
		navigator.mediaDevices.getUserMedia(mediaConfig).then(function(stream) {
			_streamCopy = stream;
			video.src = window.URL.createObjectURL(stream);
			video.play();
		});
	}
	return(camera);
}
