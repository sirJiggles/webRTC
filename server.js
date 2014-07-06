var express = require('express'),
	app = express();

app.configure(function(){
	//app.engine('html', require('ejs').renderFile);
	//app.set('view engine', 'html');
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

// now start the server
var server = app.listen(5000, function(){
	console.log('Server up and running on port %d', server.address().port);
});