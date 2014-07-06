
/*
 * Main javascript file
 * 
 * require all js files in order using juicer
 * 
 * @depends vendor/jquery.min.js
 * @depends vendor/adaptor.js
 * @depends app/sound-modifier.js
 * @depends app/optimus-head.js
 * @depends vendor/clmtracker.min.js
 * @depends vendor/pModel.js
 */

 // the global app var
 var app = {};

// class for all the functions
var webRTCApp = function(){

	// set up our canvas tag (just need a handle for resize here)
	this.canvas = document.getElementById('canvas');
	this.ctx = this.canvas.getContext('2d');

	// debug mode
	this.debug = false;
	this.debugCanvas = document.getElementById('debugCanvas');
	this.debugCtx = this.debugCanvas.getContext('2d');

	// settings for animation loop
	this.interval = 1000 / 60;
    this.lastTime = (new Date()).getTime();
    this.currentTime = 0;
    this.delta = 0;

	// resize timeout
	this.resizeTimer = null;

	// aspect ratio settings for the canvas resize
	this.widthToHeight =  (4 / 3);
	this.canvasWrapper = $('#canvasWrapper');
	this.inner = $('#inner');
	this.width = this.canvasWrapper.innerWidth();
	this.height = this.canvasWrapper.innerHeight();

	// video tag
	this.vid = document.getElementById('localFeed');

	// register events
	this.initEvents();

	// set up face tracker
	this.ctracker = new clm.tracker({useWebGL : true});
	this.ctracker.init(pModel);

	// create a new instance of the optimus prime head
	this.optimus = new OptimusHead();

	// create a new instance of the audio modifier
	this.soundModifier = new soundModifier();

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
};

function track(){
	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          function(callback){
	            window.setTimeout(callback, core.interval);
	          };
	})();

	(function animloop(){
		
		app.currentTime = (new Date()).getTime();
		app.delta = (app.currentTime - app.lastTime);

		// if at least 1 frame has passed in time (1000/fps)
		if(app.delta > app.interval) {

			
			var positions = app.ctracker.getCurrentPosition();

		    if (positions) {
		    	// draw the head of optimus on the canvas tag .....
		    	app.ctx.clearRect(0, 0, app.canvas.width, app.canvas.height);
		    	app.optimus.update(positions);

		    	if(app.debug){
		    		app.debugCtx.clearRect(0, 0, app.canvas.width, app.canvas.height);
		    		app.ctracker.draw(app.debugCanvas);
	    		}
			}
			// set the last time
			app.lastTime = app.currentTime - (app.delta % app.interval);
		}

		// call this again on animation frame
		requestAnimFrame(animloop);

	})();
}


// what to do on resize, just change the size of the canvas tag for now while maintaining aspect ratio
function resizeWindowCallback(){

	if(!app){ return false; }

	// do all aspect ratio calculations
	app.width =  $(app.canvasWrapper).innerWidth();
	app.height = $(app.canvasWrapper).innerHeight();

	var newWidthToHeight = app.width / app.height;
	if(newWidthToHeight > app.widthToHeight){
		app.width = app.height * app.widthToHeight;
	}else{
		app.height = app.width / app.widthToHeight;
	}

	$(app.inner).css({
		'width': app.width,
		'height': app.height,
		'margin-top':-app.height / 2,
		'margin-left':-app.width / 2
	});

	// resize the canvas tag itself
	app.canvas.width = app.width;
	app.canvas.height = app.height;
	app.vid.width = app.width;
	app.vid.height = app.height;

	if(app.debug){
		this.debugCanvas.width = app.width;
		this.debugCanvas.height = app.height;
	}
}

function gotLocalStream (stream){

	window.stream = stream; // stream available to console

	// send the stream to the video tag
	app.vid.src = (window.URL) ? window.URL.createObjectURL(stream) : stream;

	app.ctracker.start(app.vid);
	track();

	// handle the audio data from the local stream
	app.soundModifier.init();
	
};


// error callback for user media
function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
};

// On load
$(window).load(function(){
	app = new webRTCApp();

	// set the size of the canvas 
	resizeWindowCallback();
});

// on Resize
$(window).resize(function(){
    clearTimeout(app.resizeTimer);
    app.resizeTimer = setTimeout(resizeWindowCallback, 20);
});

