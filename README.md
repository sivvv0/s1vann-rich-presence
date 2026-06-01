<div align="center">

@s1vann/rich-presence

Modern Discord Rich Presence Framework

<img src="https://img.shields.io/npm/v/@s1vann/rich-presence?style=for-the-badge" />
<img src="https://img.shields.io/node/v/@s1vann/rich-presence?style=for-the-badge" />
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<br />

Powerful and modern Discord RPC framework for Node.js applications.

Built for:
Games • Apps • Bots • Tools • Streaming • Custom Presence

</div>

⸻

# ✨ Features

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

# 📦 Installation
```js
npm install @s1vann/rich-presence
```
⸻

# 🚀 Quick Start
```js
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
```
⸻

# 🎮 Helper Methods

**Playing**
```js
rpc.setPlaying('Minecraft');
```
**Watching**
```js
rpc.setWatching('One Piece');
```
# Listening
```js
rpc.setListening('Spotify');
```
# Streaming
```js
rpc.setStreaming(
  'Live Stream',
  'https://twitch.tv/example'
);
```
⸻

**⏱ Timestamp Helpers**

*Elapsed Time*
```js
rpc.updatePresence({
  details: 'Coding',
  startTimestamp: rpc.elapsed()
});
```
# Remaining Time
```js
rpc.updatePresence({
  details: 'Movie',
  endTimestamp: rpc.remaining(3600)
});
```
⸻

## 📊 Progress Helper
```js
const progress = rpc.progress(300, 1000);
rpc.updatePresence({
  details: 'Downloading',
  ...progress
});
```
⸻

# 🔘 Buttons
```js
rpc.updatePresence({
  details: 'My Application',
  buttons: rpc.buttons([
    ['Website', 'https://s1vann.site'],
    ['Discord', 'https://discord.gg/example']
  ])
});
```
⸻

# 🎨 Assets
```js
rpc.updatePresence({
  details: 'Watching',
  ...rpc.assets(
    'large-image',
    'small-image'
  )
});
```
⸻

# 🔥 Presets

* Netflix
```js
rpc.updatePresence(
  rpc.presets.netflix()
);
```
* YouTube
```js
rpc.updatePresence(
  rpc.presets.youtube()
);
```
* VS Code
```js
rpc.updatePresence(
  rpc.presets.vscode()
);
```
* Gaming
```js
rpc.updatePresence(
  rpc.presets.gaming('Minecraft')
);
```
⸻

# 🪄 Join Secrets

* Create Secret
```js
const secret = rpc.createJoinSecret({
  room: '1234'
});
```
* Parse Secret
```js
const data = rpc.parseJoinSecret(secret);
```
⸻

# 📡 Events
```js
rpc.on('connected', () => {});
rpc.on('disconnected', () => {});
rpc.on('join', (secret) => {});
rpc.on('spectate', (secret) => {});
rpc.on('joinRequest', (user) => {});
rpc.on('error', (error) => {});
```
⸻

# ✅ Join Request Replies
```js
rpc.reply(user, 'YES');
rpc.reply(user, 'NO');
rpc.reply(user, 'IGNORE');
```
⸻

# 🧠 Queue Presence

* Useful before Discord fully connects.
```js
rpc.queuePresence({
  details: 'Loading...'
});
```
⸻

* 🧹 Clear Presence
```js
rpc.clearPresence();
```
⸻

* 🔌 Disconnect
```js
rpc.disconnect();
```
⸻

* 🐛 Debug Mode
```js
const rpc = createRPC('CLIENT_ID', {
  debug: true
});
```
*Debug logs:*

* Connections
* Reconnects
* Presence Updates
* Errors

⸻

# ⚙ Options
```js
Option	Type	Default
autoReconnect	boolean	true
reconnectInterval	number	5000
debug	boolean	false
transport	string	ipc
```
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

# 💡 Example Project
```js
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
```
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
