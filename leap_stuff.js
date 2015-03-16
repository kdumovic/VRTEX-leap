/*
 * Uses leap.js v2
 * Tutorial here: https://developer.leapmotion.com/getting-started/javascript/video-tutorial
 */

console.log("Loading leap stuff");

// -------------------- //


// The following is from osc-web/web-side/app.html 
socket = io.connect('http://127.0.0.1', { port: 8081, rememberTransport: false});
socket.on('connect', function() {
    // sends to socket.io server the host/port of oscServer
    // and oscClient
    socket.emit('config',
        {
            server: {
                port: 3333,
                host: '127.0.0.1'
            },
            client: {
                port: 4000, // 3334
                host: '192.168.43.214' // '127.0.0.1'
            }
        }
    );
});

// socket.on('message', function(obj) {
//     var status = document.getElementById("status");
//     status.innerHTML = obj[0];
//     console.log(obj);
// });

global_hand_radius = 0;

function sendOSCData(msg) {
	if (!msg) { 
		msg = global_hand_radius;
	}
	console.log("Sending OSC data... " + msg);
	socket.emit('message', { address: '/leftradius', arg: msg });
}



// -------------------- //



function concatData(id, data) {
	return id + ': ' + data + '<br>';
}

function concatJointPosition(id, pos) {
	return id + ': ' + pos[0] + ', ' + pos[1] + ', ' + pos[2] + '<br>';
}

function getFingerName(fingerType) {
	switch(fingerType) {
		case 0:
			return 'Thumb';
			break;
		case 1:
			return 'Index';
			break;
		case 2:
			return 'Middle';
			break;
		case 3:
			return 'Ring';
			break;
		case 4:
			return 'Pinky';
			break;
	}
}

var RADIUS_BOOSTER = 2.0;

var output = document.getElementById('output');
var circle_left = document.getElementById('palm_circle_left');
var circle_right = document.getElementById('palm_circle_right');

var frameString = '', handString = '', fingerString = '';
var hand, finger;

// leap.loop uses browser's requestAnimationFrame
var options = { enableGestures: true }


// Main Leap loop
Leap.loop(options, function(frame) {
	frameString = concatData("frame_id", frame.id);
	frameString += concatData("num_hands", frame.hands.length);
	frameString += concatData("num_fingers", frame.fingers.length);
	frameString += "<br>";

	for (var i = 0, len = frame.hands.length; i < len; i++) {
		hand = frame.hands[i];
		handString = concatData("hand_type", hand.type);
		handString += concatJointPosition("hand_position", hand.palmPosition);
		handString += concatData("hand_velocity", hand.palmVelocity);
		handString += concatData("hand_direction", hand.direction);
		handString += concatData("hand_sphere_radius", hand.sphereRadius);

		if (hand.type == 'left') {
			circle_left.style.width = hand.sphereRadius*RADIUS_BOOSTER;
			circle_left.style.height = hand.sphereRadius*RADIUS_BOOSTER;
			global_hand_radius = hand.sphereRadius;
			socket.emit('message', { address: '/leftradius', arg: hand.sphereRadius });
			//sendOSCData(String(hand.sphereRadius));
		}

		if (hand.type == 'right') {
			circle_right.style.width = hand.sphereRadius*RADIUS_BOOSTER;
			circle_right.style.height = hand.sphereRadius*RADIUS_BOOSTER;
			socket.emit('message', { address: '/rightradius', arg: hand.sphereRadius });
		}

		// handString += concatData("confidence", hand.confidence); //between 0 and 1
		// handString += concatData("pinch_string", hand.pinchStrength);
		// handString += concatData("grab_strength", hand.grabStrength);
		handString += "<br>";

		// fingerString = "";
		// for (var j = 0, len2 = hand.fingers.length; j < len2; j++) {
		// 	finger = hand.fingers[j];
		// 	fingerString += concatData("finger_type", finger.type) + " (" + getFingerName(finger.type) + ") <br>"
		// 	fingerString += concatJointPosition("finger_dip", finger.dipPosition);
		// 	fingerString += concatJointPosition("finger_pip", finger.pipPosition);
		// 	fingerString += concatJointPosition("finger_mcp", finger.mcpPosition);
		// 	fingerString += "<br>";
		// }

		frameString += handString;
		// frameString += fingerString;
	}
	output.innerHTML = frameString;
});
