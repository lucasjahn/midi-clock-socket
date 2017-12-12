//client.js
var io = require('socket.io-client');
var socket = io.connect('http://188.68.34.84:3000', {reconnect: true});

var count = 0;
var last = new Date().getTime()
var bpm = 250;

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});

// Send a MIDI message.
function beat(){
	//output.sendMessage([248]);

	socket.emit('CH01', [248]);

	count ++;
	if (count >= 24 * 16){
		count = 0;
		//output.sendMessage([250]);
	}
	var now = new Date().getTime()
	setTimeout(beat, last + 60000 / bpm / 24 - now);
	last += 60000 / bpm / 24;
}

beat()