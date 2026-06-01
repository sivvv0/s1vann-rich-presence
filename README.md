<div align="center">

@s1vann/rich-presence

Modern Discord Rich Presence Framework

<img src="https://img.shields.io/npm/v/@s1vann/rich-presence?style=for-the-badge" />
<img src="https://img.shields.io/npm/dt/@s1vann/rich-presence?style=for-the-badge" />
<img src="https://img.shields.io/github/license/s1vann/rich-presence?style=for-the-badge" />
<img src="https://img.shields.io/node/v/@s1vann/rich-presence?style=for-the-badge" />
<br />

Powerful and modern Discord RPC framework for Node.js applications.

Built for:
Games • Apps • Bots • Tools • Streaming • Custom Presence

</div>

⸻

✨ Features

* 🚀 Modern Discord RPC Support
* 🔄 Auto Reconnect System
* 🎮 Rich Presence Helpers
* 📦 Lightweight & Fast
* 🧠 Queue System
* 🎯 Buttons Builder
* ⏱ Progress & Timestamp Helpers
* 🎨 Asset Helpers
* 🛡 Error Handling
* 📡 Event System
* 🔥 Activity Presets
* 🪄 Join Secret Utilities
* 🛠 Debug Mode
* ⚡ Node.js 18+ Support

⸻

📦 Installation

npm install @s1vann/rich-presence

⸻

🚀 Quick Start

const createRPC = require('@s1vann/rich-presence');
const rpc = createRPC('YOUR_CLIENT_ID', {
  debug: true,
  autoReconnect: true
});
rpc.on('connected', async () => {
  console.log('Connected to Discord');
  await rpc.updatePresence({
    details: 'Watching Anime',
    state: 'Episode 5',
    largeImageKey: 'anime',
    largeImageText: 'My App',
    startTimestamp: Date.now(),
    buttons: rpc.buttons([
      ['Website', 'https://example.com'],
      ['Discord', 'https://discord.gg/example']
    ])
  });
});
rpc.on('error', console.error);

⸻

🎮 Helper Methods

Playing

rpc.setPlaying('Minecraft');

Watching

rpc.setWatching('One Piece');

Listening

rpc.setListening('Spotify');

Streaming

rpc.setStreaming(
  'Live Stream',
  'https://twitch.tv/example'
);

⸻

⏱ Timestamp Helpers

Elapsed Time

rpc.updatePresence({
  details: 'Coding',
  startTimestamp: rpc.elapsed()
});

Remaining Time

rpc.updatePresence({
  details: 'Movie',
  endTimestamp: rpc.remaining(3600)
});

⸻

📊 Progress Helper

const progress = rpc.progress(300, 1000);
rpc.updatePresence({
  details: 'Downloading',
  ...progress
});

⸻

🔘 Buttons

rpc.updatePresence({
  details: 'My Application',
  buttons: rpc.buttons([
    ['Website', 'https://example.com'],
    ['Discord', 'https://discord.gg/example']
  ])
});

⸻

🎨 Assets

rpc.updatePresence({
  details: 'Watching',
  ...rpc.assets(
    'large-image',
    'small-image'
  )
});

⸻

🔥 Presets

Netflix

rpc.updatePresence(
  rpc.presets.netflix()
);

YouTube

rpc.updatePresence(
  rpc.presets.youtube()
);

VS Code

rpc.updatePresence(
  rpc.presets.vscode()
);

Gaming

rpc.updatePresence(
  rpc.presets.gaming('Minecraft')
);

⸻

🪄 Join Secrets

Create Secret

const secret = rpc.createJoinSecret({
  room: '1234'
});

Parse Secret

const data = rpc.parseJoinSecret(secret);

⸻

📡 Events

rpc.on('connected', () => {});
rpc.on('disconnected', () => {});
rpc.on('join', (secret) => {});
rpc.on('spectate', (secret) => {});
rpc.on('joinRequest', (user) => {});
rpc.on('error', (error) => {});

⸻

✅ Join Request Replies

rpc.reply(user, 'YES');
rpc.reply(user, 'NO');
rpc.reply(user, 'IGNORE');

⸻

🧠 Queue Presence

Useful before Discord fully connects.

rpc.queuePresence({
  details: 'Loading...'
});

⸻

🧹 Clear Presence

rpc.clearPresence();

⸻

🔌 Disconnect

rpc.disconnect();

⸻

🐛 Debug Mode

const rpc = createRPC('CLIENT_ID', {
  debug: true
});

Debug logs:

* Connections
* Reconnects
* Presence Updates
* Errors

⸻

⚙ Options

Option	Type	Default
autoReconnect	boolean	true
reconnectInterval	number	5000
debug	boolean	false
transport	string	ipc

⸻

📋 Requirements

* Node.js 18+
* Discord Desktop App
* Discord Developer Application

⸻

🔑 Getting a Client ID

1. Open Discord Developer Portal
2. Create an Application
3. Copy the Application ID
4. Use it as your CLIENT_ID

⸻

💡 Example Project

const createRPC = require('@s1vann/rich-presence');
const rpc = createRPC('CLIENT_ID', {
  debug: true
});
rpc.on('connected', async () => {
  console.log('Connected');
  await rpc.setWatching('One Piece');
  setTimeout(async () => {
    await rpc.setPlaying('Minecraft');
  }, 5000);
});

⸻

<div align="center">

⭐ Support

If you like this project, consider giving it a star on GitHub.

</div>

⸻

<div align="center">

Made with ❤️ by @s1vann

</div>

:
