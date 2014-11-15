var app = require('express')();
var jwt = require('socketio-jwt');
var config = require('./config.js').getConfig();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.use(jwt.authorize({
    secret: config.jwt_secret,
    handshake: true
}));

io.on('connection', function(socket){
    socket.on('room', function(room) {
        // private channel
        if (room.indexOf('u.') === 0) {
            var username = socket.decoded_token.username;

            if (username !== room.slice(3)) return;
        }

        socket.join(room);
    });
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/', function (req, res) {
    req.body.topics.forEach(function(topic) {
        io.in(topic).emit('msg', req.body.data);
    });

    res.send('OK!');
});

server.listen(config.ws_port);
console.log('WS Server binded to port: '+ config.ws_port);
