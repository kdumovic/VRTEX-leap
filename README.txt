VRtex Leap Documentation

<b>Overview</b>

This platform allows users to interact with the Leap Motion in-browser, whilst sending messages in real-time over the OSC (Open Sound Control) protocol.

In browser we use the Javascript SDK (leap.js v2) to get motion tracking data from the Leap. We convey this data to the user and then send it to the OSC client we have running in VRtex-server/. 

Since today's web browsers do not natively support sending and receiving messages over UDP (User Datagram Protocol) and OSC is a protocol over UDP, we utilize a "web bridge," or server running on the client side that acts as an intermediary, converting messages we send across web sockets in browser into messages that support the OSC protocol. This code is provided by the open-source osc-web app (https://github.com/automata/osc-web).

<b>Getting Started<b>

First we must set up osc-web. See the documentation in osc-web/README.org. osc-web requires node.js and socket.io. 

To run the bridge app in OS X or UNIX we open a shell to the VRtex-leap working directory and:

	cd osc-web
	node bridge.js

And we're done.

All of our Leap code is running in index.html. Open index.html in your favorite web browser (currently Firefox is best-supported).

And that's it.

You should see two spheres--one blue, one red. Each sphere should update in size according to the "sphere radius" of your left or right hand, respectively, placed above the Leap Motion. You can learn more about sphere radius and the other data supported by the Leap's Hand tracking class here: https://developer.leapmotion.com/documentation/java/api/Leap.Hand.html

<b>Our Code</b>

The Leap code is fairly self-explanatory. See leap_stuff.js. Much of it was inspired by a tutorial found here: https://developer.leapmotion.com/getting-started/javascript/video-tutorial

The Leap data we're interested in is conveyed to the user by an field in the "output" div that is updated at the polling rate.

To send our Leap data across OSC, we must first open a web socket in Javascript (see osc_stuff.js) to the osc-web socket.io server that we've just started. We configure this server with the host and port of the local server and OSC client. In this case the local server is 'localhost':3333 and the OSC client is defined in VRtex-server/. While this is not well-documented by the osc-web app, an example can be found is osc-web/web-side/app.html. 

If we were to define the OSC client as localhost instead of VRtex-server and specify a port other than 3333, we can see the OSC messages carrying Leap data being sent by the browser with an OSC monitoring tool such as Peter Raffensperger's OSC Monitor for OS X (https://code.google.com/p/oscmonitor/) or Frieder Weiss's OSC Monitor for Windows (http://frieder-weiss.de/OSC/OSCMonitor.zip).

Note: We did however need to slightly modify osc-web with a change to line 19 of bridge.js to allow support for arguments sent across the OSC client as opposed to just sending addresses. We do this because we structure our OSC messages with an address processed by VRtex-server (e.g. left-hand) and the associated data we wish to send. We may need to make this more robust in the future and plan to fork the osc-web app.

<b>Troubleshooting</b>

If index.html fails to load with the console logged reference error "io is not defined" this means that the osc-web server has crashed or is otherwise no longer running. Simply re-run bridge.js in node and refresh index.html. 

<b>Known Bugs<b>

Refreshing index.html tends to crash the osc-web bridge. You must re-run bridge.js as specified above on each refresh.
