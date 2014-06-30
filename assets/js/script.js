
/*
 * Main javascript file
 * 
 * require all js files in order using juicer
 * 
 * @depends vendor/jquery.min.js
 * @depends vendor/adaptor.js
 */

 // the global app var
 var app = {};

// class for all the functions
var webRTCApp = function(){
	this.localFeed = null;
	this.remoteFeed = null;

	this.initEvents();
};

 webRTCApp.prototype.gotStream = function(stream) {

	window.stream = stream; // stream available to console
	if (window.URL) {
	    this.localFeed.src = window.URL.createObjectURL(stream);
  	} else {
	    this.localFeed.src = stream;
  	}


  	// handle the audio data from the local stream
  	window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();

    // Create an AudioNode from the stream
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Connect it to destination to hear yourself
    // or any other node for processing!
    mediaStreamSource.connect(audioContext.destination);
};

// error callback for user media :D
webRTCApp.prototype.errorCallback = function(error){
  console.log("navigator.getUserMedia error: ", error);
};

// events like the click on the controls
webRTCApp.prototype.initEvents = function(){

	// click events for filters
	$('.controlls a').click(function(evnt){
		evnt.preventDefault();
		app.localFeed.removeClass().addClass($(this).text());
	});

};

// On load
window.onload = (function () {

	app = new webRTCApp();

	app.localFeed = $('#localFeed'),
	app.remoteFeed = $('#remoteFeed');

	var constraints = {
		audio:true, 
		video:true
	};

	navigator.getUserMedia(constraints, app.gotStream, app.errorCallback);

})();


