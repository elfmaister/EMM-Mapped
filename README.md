#EMM-Mapped

EMM-Mapped is a tool designed to enhance the spectating experience for EMM Hunted in Garry's Mod by providing an interactive, real-time player tracking system on the gm_bigcity map.

Features





Tracks player positions and velocities in real-time.



Displays data on an interactive browser-based map.



Built for the gm_bigcity map in Garry's Mod.

Installation





Client-Side Setup:





Place emm_client.lua in garrysmod/garrysmod/lua/autorun/client/.



Spectating Platform:





Create a folder and add index.html and script.js.



Open index.html in a web browser to view the gm_bigcity map with real-time player tracking.



Server Setup:





The server is hosted at https://emm-mapped.onrender.com/data.



Requires package.json and server.js for operation.

Usage





Ensure the Garry's Mod client is running emm_client.lua.



Open index.html in a browser to spectate player positions and velocities on the gm_bigcity map.



The server (server.js) streams real-time data to the web interface.

Requirements





Garry's Mod with the gm_bigcity map.



A modern web browser.



Node.js (for running the server locally, if desired).

Contributing

Feel free to submit issues or pull requests to improve the tool. Ensure any changes are tested with gm_bigcity.

License

MIT License
