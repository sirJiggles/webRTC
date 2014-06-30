
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
    this.settupConnection();
};

// this is where we start the call
webRTCApp.prototype.settupConnection = function(){
	var servers = null;

  	this.localPeerConnection = new webkitRTCPeerConnection(servers);
	this.localPeerConnection.onicecandidate = this.gotLocalIceCandidate;

	this.remotePeerConnection = new webkitRTCPeerConnection(servers);
  	this.remotePeerConnection.onicecandidate = this.gotRemoteIceCandidate;
  	this.remotePeerConnection.onaddstream = this.gotRemoteStream;

  	this.localPeerConnection.addStream(window.stream);
	this.localPeerConnection.createOffer(this.gotLocalDescription);
};

webRTCApp.prototype.gotLocalDescription = function(description){
  	this.localPeerConnection.setLocalDescription(description);
  	this.remotePeerConnection.setRemoteDescription(description);
  	this.remotePeerConnection.createAnswer(this.gotRemoteDescription);
}

webRTCApp.prototype.gotRemoteDescription = function(description){
  	this.remotePeerConnection.setLocalDescription(description);
	this.localPeerConnection.setRemoteDescription(description);
}

webRTCApp.prototype.gotRemoteStream = function(event){
  	this.remoteFeed.src = URL.createObjectURL(event.stream);
}

webRTCApp.prototype.gotLocalIceCandidate = function(event){
  	if (event.candidate) {
    	this.remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
  	}
}

webRTCApp.prototype.gotRemoteIceCandidate = function(event){
	if (event.candidate) {
		this.localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
	}
}

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
		audio:false, 
		video:true
	};

	// get the local stream, when thats run we will create the fake remote connection
	navigator.getUserMedia(constraints, app.gotLocalStream, app.errorCallback);

})();


