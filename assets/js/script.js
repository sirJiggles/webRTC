
/*
 * Main javascript file
 * 
 * require all js files in order using juicer
 * 
 * @depends vendor/jquery.min.js
 * @depends vendor/flexslider.min.js
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

webRTCApp.prototype.gotLocalStream = function(stream) {

	window.stream = stream; // stream available to console
	if (window.URL) {
	    this.localFeed.src = window.URL.createObjectURL(stream);
  	} else {
	    this.localFeed.src = stream;
  	}


  	// handle the audio data from the local stream
  	/*window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();

    // Create an AudioNode from the stream
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Connect it to destination to hear yourself
    // or any other node for processing!
    mediaStreamSource.connect(audioContext.destination);*/

    // start running the remote connection test
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

	// clicking record
	$('#record').click(function(evnt){
		evnt.preventDefault();

		$(this).addClass('stop');

		var constraints = {
			audio:false, 
			video:true
		};

		// get the local stream, when thats run we will create the fake remote connection
		navigator.getUserMedia(constraints, app.gotLocalStream, app.errorCallback);

	});

};

// On load
$(window).load(function(){
	app = new webRTCApp();
	app.localFeed = $('#localFeed'),

	// set up flex sliders
	$(".flexslider").flexslider({
		animation: "slide",
		useCSS: true,
		touch: true,
		animationLoop: true,
		smoothHeight: true,
		controlNav: false,
		directionNav: false,
		slideshow: false,
		direction: "vertical"
  	});

});


