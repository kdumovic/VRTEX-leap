/*
 * Uses osc.js
 * Documentation here: https://www.npmjs.com/package/osc
 */

// Using this now: https://github.com/automata/osc-web
// cd osc-web/
// node bridge.js
//

// // The following is from osc-web/web-side/app.html 
// socket = io.connect('http://127.0.0.1', { port: 8081, rememberTransport: false});
// socket.on('connect', function() {
//     // sends to socket.io server the host/port of oscServer
//     // and oscClient
//     socket.emit('config',
//         {
//             server: {
//                 port: 3333,
//                 host: '127.0.0.1'
//             },
//             client: {
//                 port: 3334,
//                 host: '127.0.0.1'
//             }
//         }
//     );
// });

// // socket.on('message', function(obj) {
// //     var status = document.getElementById("status");
// //     status.innerHTML = obj[0];
// //     console.log(obj);
// // });

// function sendOSCData(msg) {
// 	if (!msg) { 
// 		msg = global_hand_radius;
// 	}
// 	console.log("Sending OSC data... " + msg);
// 	socket.emit('message', msg);
// }

// Code from: http://www.tutorialspoint.com/html5/html5_websocket.htm
// Must have already run sudo python standalone.py -p 9998 -w ../example/
// Where pywebsocket-x.x.x/src/mod_pywebsocket/standalone.py
function startWebSocket() {
  sendOSCData('starting web socket');
  if ("WebSocket" in window) {
     console.log("WebSocket is supported by your Browser!");

     // Let us open a web socket
     var ws = new WebSocket("ws://localhost:9998/echo"); // orig 9998/echo

     ws.onopen = function() {
        // Web Socket is connected, send data using send()
        console.log("Opening Web Socket...");
        msg = "SAMPLE MESSAGE"
        console.log("Sending message contents: " + msg)
        ws.send(msg)
     };

     ws.onmessage = function(evt) { 
        var received_msg = evt.data;
        console.log("Message is received with contents: " + received_msg);
     };

     ws.onclose = function() { 
        // websocket is closed.
        console.log("Web Socket Connection is closed..."); 
     };

  } else {
     // The browser doesn't support WebSocket
     console.log("WebSocket NOT supported by your Browser!");
  }
}

var oscPort = new osc.WebSocketPort({
    //url: "ws://localhost:8081" // URL to your Web Socket server. 
    url: "ws://localhost:3334"
});

oscPort.on("message", function(oscMsg) {
    console.log("An OSC message just arrived!", oscMsg);
});

function sendOSCDataWithOSCJS() {
	console.log("Sending OSC data...");
	oscPort.send({
		address: "/carrier/frequency",
	    args: 440
	});
}

// Below is from here: https://github.com/colinbdclark/osc.js-examples/tree/master/browser

// var osc = require("osc"),
//     express = require("express"),
//     WebSocket = require("ws");

// var getIPAddresses = function () {
//     var os = require("os"),
//         interfaces = os.networkInterfaces(),
//         ipAddresses = [];

//     for (var deviceName in interfaces) {
//         var addresses = interfaces[deviceName];
//         for (var i = 0; i < addresses.length; i++) {
//             var addressInfo = addresses[i];
//             if (addressInfo.family === "IPv4" && !addressInfo.internal) {
//                 ipAddresses.push(addressInfo.address);
//             }
//         }
//     }

//     return ipAddresses;
// };

// // Bind to a UDP socket to listen for incoming OSC events.
// var udpPort = new osc.UDPPort({
//     localAddress: "0.0.0.0",
//     localPort: 57121
// });

// udpPort.on("ready", function () {
//     var ipAddresses = getIPAddresses();
//     console.log("Listening for OSC over UDP.");
//     ipAddresses.forEach(function (address) {
//         console.log(" Host:", address + ", Port:", udpPort.options.localPort);
//     });
// });

// udpPort.open();

// // Create an Express-based Web Socket server to which OSC messages will be relayed.
// var appResources = __dirname + "/web",
//     app = express(),
//     server = app.listen(8081),
//     wss = new WebSocket.Server({
//         server: server
//     });

// app.use("/", express.static(appResources));
// wss.on("connection", function (socket) {
//     console.log("A Web Socket connection has been established!");
//     var socketPort = new osc.WebSocketPort({
//         socket: socket
//     });

//     var relay = new osc.Relay(udpPort, socketPort, {
//         raw: true
//     });
// });