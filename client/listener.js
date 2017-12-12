var midi = require('midi');
var io = require('socket.io-client');
var socket = io.connect('http://188.68.34.84:3000', {reconnect: true});

var output = new midi.output();

output.openVirtualPort("A Beat!");
output.sendMessage([250]);

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});

socket.on('Clock', (msg) => {
    output.sendMessage([248]);
});