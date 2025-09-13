EMM-Mapped: Real-Time Player Tracking for EMM
EMM-Mapped transforms the spectating experience for EMM(Extended Movement Mod) in Garry's Mod by providing a dynamic, browser-based map that tracks player positions and velocities in real-time on the gm_bigcity map.
Features

Real-Time Player Tracking: Monitor local player positions and velocities as they move across the gm_bigcity map.
Interactive Web Map: View player movements on a browser-based interface, enhancing spectating with live updates.
Tailored for gm_bigcity: Designed specifically for the gm_bigcity map, ensuring accurate visualization. Explore the map.

Installation
Prerequisites

Garry's Mod with the gm_bigcity map installed.
A modern web browser (e.g., Chrome, Firefox, or Edge).
(Optional) Node.js for running a local WebSocket server.

Client-Side Setup

Copy emm_client.lua to your Garry's Mod directory:garrysmod/garrysmod/lua/autorun/client/.
Launch Garry's Mod and ensure the gm_bigcity map is loaded.

Web Interface Setup

Create a folder (e.g., emm-mapped) and place index.html and the gm_bigcity folder (containing map assets) inside it.
Start a local server in the folder:  python3 -m http.server 8000


Open http://localhost:8000/ in your web browser to view the interactive map.

Server Setup

Hosted Option: Use the WebSocket server at https://emm-mapped.onrender.com/data for seamless data streaming.
Local Option: To run the server locally:
Ensure package.json and server.js are in your project folder.
Install dependencies:  npm install


Start the server:  node server.js





Usage

Launch Garry's Mod with emm_client.lua running.
Open http://localhost:8000/ in your browser to view the real-time map.
Watch player positions and velocities update live as they move through gm_bigcity.

Contributing
Contributions are welcome! To contribute:

Test changes on the gm_bigcity map.
Submit issues or pull requests via the repository.

License
MIT License
