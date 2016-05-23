var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//TODO: Could be /web or /group_directory, etc.
app.use(express.static(__dirname + '/web'));

app.get('/', function(req, res){
  res.render('/index.html');
});

server.listen(80);
console.log("Multiplayer app listening on port 80");
