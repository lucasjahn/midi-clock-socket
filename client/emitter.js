var midi = require('midi');

var io = require('socket.io-client');
var socket = io.connect('http://188.68.34.84:3000', {reconnect: true});

var MIDI_PPQN = 24
var SOCKET_PPQN = 4;
var MIDI_CLOCK = 248;
var MIDI_START = 251;
var MIDI_CONTINUE = 252;
var clockCount = 0;


// Set up a new input.
var input = new midi.input();

var devices = [];
for (var i = 0; i < input.getPortCount(); i ++){
	devices[i] = input.getPortName(i);
}

if (process.argv.length < 4){
	console.log('Run the server using "node pulserver.js [device_id] [port]"');
	console.log('    e.g. "node pulserver.js 0 9000"');

	console.log("The following MIDI devices were detected:");
	if (devices.length == 0){
		console.log("...NO DEVICES DETECTED...");
	} else {
		for (var i = 0; i < devices.length; i ++){
			console.log( "id: " + i + "\t" + devices[i]);
		}
	}
	process.exit(0);
} else {
	var deviceID = parseInt(process.argv[2])
	var port = parseInt(process.argv[3])

	if (deviceID >= devices.length){
		throw "Device " + deviceID + " unknown."
	}
	console.log("Listening to device " + deviceID + ": " + devices[deviceID])

	socket.on('connect', function (socket) {
		console.log('Connected!');
	});

	var previousSendValue;
	
	var midiReceived = function(deltaTime, message){
		// Throttle the number of clock messages sent.
		// The midi standard of 24 pulses-per-quarter-note 
		// (e.g. 120*24 = 2880 messages per second @ 12bpm) is a
		// little high to pump through a web socket.
		if (message[0] === 248) {
			// var bpm = 60 / (24 * deltaTime)
			var bpm = 2.5 / deltaTime;
	  
			if (bpm < 60) {
			  bpm = bpm * 2;
			}
			else if (bpm > 187) {
			  bpm = bpm / 2;
			}
	  
			var value = Math.round(bpm - 60);
			//if (value != previousSendValue) {
			  //output.sendMessage([config.message.status, config.message.control, value]);
			  socket.emit('CH01', value);
			  //previousSendValue = value;
			//}
		  }
	}

	input.openPort(deviceID);
	input.ignoreTypes(true, false, true);
	input.on('message', midiReceived);	

}
