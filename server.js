var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

app.configure(function(){
	app.use(express.static(__dirname + '/'));
});

app.get('/', function(req, res){
	res.sendfile('index.html');
});
app.get('/track', function(req, res){
	res.sendfile('track-face.html');
});
app.get('/swap', function(req, res){
	res.sendfile('face-swap.html');
});
app.get('/chat', function(req, res){
	res.sendfile('video-chat.html');
});

// this is the server for the communication with he rooms and where we sort out who can join what etc
// this is whats known as a signalling server! this handles all the signalling events from one connection to another
io.on('connection', function(socket){

		console.log('a user connected to the chat room');

  	socket.on('message', function (message) {
		console.log('Got message:', message);
    	// for a real app, would be room only (not broadcast)
		socket.broadcast.emit('message', message);
	});


	socket.on('create or join', function(room) {

		var clients = io.sockets.adapter.rooms[room];
		var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;

		console.log('Room ' + room + ' has ' + numClients + ' client(s)');
		console.log('Request to create or join room ' + room);

		if (numClients === 0){
			socket.join(room);
			socket.emit('created', room);
		} else if (numClients === 1) {
			io.sockets.to(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room);
		} else { // max two clients
			socket.emit('full', room);
		}
		socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
		socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

	});

	socket.on('leave', function (room){
		socket.leave(room);
		socket.emit('left', room);
	});
});

// now start the server
var server = http.listen(5000, function(){
	console.log('Server up and running on port %d', server.address().port);
});