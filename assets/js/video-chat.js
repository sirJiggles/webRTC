
/*
 * Main javascript file
 * 
 * require all js files in order using juicer
 * 
 * @depends vendor/jquery.min.js
 * @depends vendor/adaptor.js
 */

// the global app and socket vars
var app = {},
	socket = io.connect();

// class for all the functions
var webRTCApp = function(){

	this.localFeed = document.getElementById('localFeed');
	this.remoteFeed = document.getElementById('remoteFeed');

	// connection vars used later
	this.localStream = null;
	this.localPeerConnection = null;
	this.remotePeerConnection = null;


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
		if($(this).hasClass('not-yet') || $(this).hasClass('active')){
			return false;
		}
		// can make the call, proceed
		$(this).addClass('active');
		settupPeerConnection();
	});

	$('#hangup').click(function(evnt){
		evnt.preventDefault();
		if(!$('#call').hasClass('active')){
			return false;
		}
		$('#call').removeClass('active');
		endCall();
	})
};

// make the actual call (fired on click of call button)
function settupPeerConnection(){
	var servers = null;

	// settup local peer connection
	app.localPeerConnection = new RTCPeerConnection(servers);
	app.localPeerConnection.onicecandidate = gotLocalIceCandidate;

	// settup remote peer connection
	app.remotePeerConnection = new RTCPeerConnection(servers);
	app.remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
	app.remotePeerConnection.onaddstream = gotRemoteStream;

	// add the local stream to our local peer connection and create the offer
	app.localPeerConnection.addStream(app.localStream);
	app.localPeerConnection.createOffer(gotLocalDescription,errorCallback);
};

// end the call
function endCall(){
	app.localPeerConnection.close();
	app.remotePeerConnection.close();
	app.localPeerConnection = null;
	app.remotePeerConnection = null;
	socket.emit('leave', app.room);
}


function gotLocalStream (stream){

	// send the stream to the video tag
	app.localFeed.src = (window.URL) ? window.URL.createObjectURL(stream) : stream;
	app.localStream = stream;

	// can now settup peer call
	$('#call').removeClass('not-yet');

	// remove the cam icon
	$('.container').removeClass('icon-camera');
};

function gotLocalIceCandidate(evnt){
	if (evnt.candidate) {
		app.remotePeerConnection.addIceCandidate(new RTCIceCandidate(evnt.candidate));
	}
}

// the description is the sdp (session description protocal)
function gotLocalDescription(description){
	app.localPeerConnection.setLocalDescription(description);
	// description is the same as we ar on the same page
	app.remotePeerConnection.setRemoteDescription(description);
	app.remotePeerConnection.createAnswer(gotRemoteDescription,errorCallback);
}

function gotRemoteDescription(description){
	app.remotePeerConnection.setLocalDescription(description);
  	app.localPeerConnection.setRemoteDescription(description);
}

function gotRemoteIceCandidate(evnt){
	if (evnt.candidate) {
		app.localPeerConnection.addIceCandidate(new RTCIceCandidate(evnt.candidate));
	}
}

// set the remote feeds video tag src
function gotRemoteStream(evnt){
	app.remoteFeed.src = (window.URL) ? window.URL.createObjectURL(evnt.stream) : evnt.stream;
}


// error callback for user media
function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
};


// On load
$(window).load(function(){
	app = new webRTCApp();

	// get user input for room name
	app.room = prompt("Enter room name:");

	if (app.room !== "") {
		console.log('Joining room ' + app.room);
		socket.emit('create or join', app.room);
	}

	socket.on('full', function(room){
	  console.log('Room ' + room + ' is full');
	});

	socket.on('empty', function(room){
		console.log('Room ' + room + ' is empty');
	});

	socket.on('join', function(room){
		console.log('Making request to join room ' + room);
		console.log('You are the initiator!');
	});

	socket.on('left', function(room){
		console.log('left room' + room);
	});
});
