
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

	this.localFeed = $('#localFeed');
	this.remoteFeed = $('#remoteFeed');

	// register events
	this.initEvents();
};

// events like the click on the controls
webRTCApp.prototype.initEvents = function(){

	// clicking record
	$('#record').click(function(evnt){
		evnt.preventDefault();

		$(this).addClass('active');

		var constraints = {
			audio:false, 
			video:true
		};

		// get the local stream, when thats run we will create the fake remote connection
		navigator.getUserMedia(constraints, gotLocalStream, errorCallback);
	});

	$('#call').click(function(evnt){
		evnt.preventDefault();
		if($(this).hasClass('not-yet')){
			return false;
		}
		// can make the call, proceed
	});
};

function gotLocalStream (stream){

	window.stream = stream; // stream available to console

	// send the stream to the video tag
	app.localFeed.src = (window.URL) ? window.URL.createObjectURL(stream) : stream;

	// can now call remote
	$('#call').removeClass('not-yet');
	
};


// error callback for user media
function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
};

// On load
$(window).load(function(){
	app = new webRTCApp();
});
