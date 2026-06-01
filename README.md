[Doc Page](https://s1vann-rich-presence-doc.vercel.app)


<div align="center">

# 🎮 @s1vann/rich-presence

### A powerful, production-ready Discord Rich Presence wrapper with zero compromises

[![npm version](https://img.shields.io/npm/v/@s1vann/rich-presence.svg)](https://www.npmjs.com/package/@s1vann/rich-presence)
[![npm downloads](https://img.shields.io/npm/dm/@s1vann/rich-presence.svg)](https://www.npmjs.com/package/@s1vann/rich-presence)
[![Node.js Version](https://img.shields.io/node/v/@s1vann/rich-presence.svg)](https://nodejs.org)
[![License](https://img.shields.io/npm/l/@s1vann/rich-presence.svg)](https://github.com/s1vann/rich-presence/blob/main/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@s1vann/rich-presence.svg)](https://bundlephobia.com/package/@s1vann/rich-presence)

[![GitHub Stars](https://img.shields.io/github/stars/sivvv0/rich-presence.svg)](https://github.com/sivvv0/rich-presence/stargazers)

**Auto-reconnection • Queue System • Middleware • TypeScript • Zero Dependencies**

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🚀 **Core Features**
- ✅ **Auto-reconnection** - Never lose connection
- ✅ **Queue System** - Updates queue when offline
- ✅ **Middleware Support** - Transform data on the fly
- ✅ **Debounced Updates** - Smart rate limiting
- ✅ **Batch Processing** - Multiple updates in sequence

</td>
<td width="50%">

### 🔧 **Advanced**
- 📊 **Metrics & Stats** - Track everything
- 🏥 **Health Monitoring** - Built-in health checks
- 🎯 **Builder Pattern** - Fluent API design
- 📦 **Templates** - Pre-built presets
- 🔌 **Event Emitter** - Rich event system

</td>
</tr>
</table>

## 📦 Installation

```bash
# Using npm
npm install @s1vann/rich-presence

# Using yarn
yarn add @s1vann/rich-presence

# Using pnpm
pnpm add @s1vann/rich-presence
```

🚀 Quick Start

```javascript
const createRPC = require('@s1vann/rich-presence');

// Initialize
const rpc = createRPC('YOUR_CLIENT_ID_HERE', {
  debug: true  // See logs in console
});

// Update your presence
await rpc.updatePresence({
  details: 'Playing My Game',
  state: 'Level 5',
  startTimestamp: Date.now(),
  largeImageKey: 'game_logo'
});
```

🎯 Getting a Client ID

1. Go to Discord Developer Portal
2. Click New Application and name it
3. Navigate to Rich Presence → Art Assets
4. Upload your images (game_logo, music, youtube, etc.)
5. Copy your Client ID from General Information

📚 Documentation

Initialization Options

```javascript
const rpc = createRPC('CLIENT_ID', {
  autoReconnect: true,        // Auto-reconnect on disconnect
  reconnectInterval: 5000,    // Reconnect interval (ms)
  debug: false,               // Enable debug logging
  transport: 'ipc',           // 'ipc' or 'websocket'
  updateThrottle: 1000,       // Debounce throttle (ms)
  healthCheckInterval: 30000, // Health check interval (ms)
  maxQueueSize: 100,          // Maximum queue size
  enableMetrics: true         // Enable metrics collection
});
```

Basic Methods

Update Presence

```javascript
await rpc.updatePresence({
  details: 'Playing Game',           // Top line
  state: 'In Menu',                  // Bottom line
  startTimestamp: Date.now(),        // Shows "Elapsed: 00:00"
  endTimestamp: Date.now() + 3600000, // Shows "Remaining: 1h"
  largeImageKey: 'game_logo',        // Large image asset
  largeImageText: 'My Game',         // Hover text
  smallImageKey: 'online',           // Small image asset
  smallImageText: 'Online',          // Hover text
  partyId: 'party123',               // Party ID for invites
  partySize: 1,                      // Current party size
  partyMax: 4,                       // Max party size
  joinSecret: 'secret',              // Join request secret
  spectateSecret: 'spectate',        // Spectate secret
  buttons: [                         // Max 2 buttons
    { label: 'Join Game', url: 'https://discord.gg/invite' },
    { label: 'Website', url: 'https://game.com' }
  ]
});
```

Clear Presence

```javascript
await rpc.clearPresence();
```

Disconnect & Destroy

```javascript
rpc.disconnect();  // Graceful disconnect
rpc.destroy();     // Full cleanup
```

🎨 Advanced Features

Builder Pattern

Build presences with a fluent API:

```javascript
const presence = rpc.createPresence()
  .setDetails('Playing Cyberpunk 2077')
  .setState('Night City - Act 2')
  .setTimestamps(Date.now(), Date.now() + 3600000)
  .setAssets('cyberpunk_logo', 'online', 'Cyberpunk 2077', 'Online')
  .setParty('party_123', 3, 4)
  .setButtons([
    ['Join Game', 'https://discord.gg/invite'],
    ['Steam Page', 'https://store.steampowered.com']
  ])
  .build();

await rpc.updatePresence(presence);
```

Templates

Pre-built templates for common scenarios:

```javascript
// Game template
await rpc.updatePresence(rpc.templates.game({
  name: 'Minecraft',
  state: 'Survival Mode',
  partySize: 2,
  partyMax: 8,
  startTime: Date.now()
}));

// Music template
await rpc.updatePresence(rpc.templates.music({
  song: 'Bohemian Rhapsody',
  artist: 'Queen',
  album: 'A Night at the Opera'
}));

// Movie template
await rpc.updatePresence(rpc.templates.movie({
  title: 'Inception',
  episode: '2'
}));
```

Presets

One-liners for popular apps:

```javascript
// YouTube
await rpc.updatePresence(rpc.presets.youtube('Amazing Cat Video'));

// Netflix
await rpc.updatePresence(rpc.presets.netflix('Stranger Things'));

// Spotify
await rpc.updatePresence(rpc.presets.spotify({
  song: 'Blinding Lights',
  artist: 'The Weeknd'
}));

// VS Code
await rpc.updatePresence(rpc.presets.vscode({
  file: 'app.js',
  project: 'My Project'
}));

// Gaming
await rpc.updatePresence(rpc.presets.gaming('Cyberpunk 2077', 5));
```

Middleware System

Transform presence data before sending:

```javascript
// Auto-add timestamps
rpc.use(async (activity, ctx) => {
  if (!activity.startTimestamp && !activity.endTimestamp) {
    activity.startTimestamp = Date.now();
  }
  return activity;
});

// Log all updates
rpc.use(async (activity, ctx) => {
  console.log(`📡 Updating: ${activity.details}`);
  return activity;
});

// Validate buttons
rpc.use(async (activity, ctx) => {
  if (activity.buttons?.length > 2) {
    activity.buttons = activity.buttons.slice(0, 2);
  }
  return activity;
});
```

Queue System

Updates automatically queue when offline:

```javascript
// Check queue status
console.log(`Queue size: ${rpc.getQueueSize()}`);

// Manual queue
rpc.queuePresence({ details: 'Queued update' });

// Clear queue
const cleared = rpc.clearQueue();

// Queue events
rpc.on('queue:overflow', ({ dropped }) => {
  console.warn('⚠️ Queue overflow! Updates being dropped');
});
```

Debounced Updates

Perfect for rapid changes (typing indicators, etc.):

```javascript
async function onTyping() {
  await rpc.debouncedUpdate({
    details: 'User is typing...'
  }, 'typing'); // Unique key for this debouncer
}

// Called 100 times - updates only once per second
for (let i = 0; i < 100; i++) onTyping();
```

Batch Updates

Update multiple presences in sequence:

```javascript
const results = await rpc.updateBatch([
  { details: 'Loading...', largeImageKey: 'loading' },
  { details: 'In Game', state: 'Playing' },
  { details: 'Menu', state: 'Idle' }
]);

results.forEach(result => {
  if (result.success) {
    console.log('✅ Updated:', result.activity.details);
  }
});
```

Event System

Listen to various events:

```javascript
// Connection events
rpc.on('connected', () => console.log('✅ Connected to Discord'));
rpc.on('disconnected', () => console.log('❌ Disconnected'));

// Error handling
rpc.on('error', (err) => console.error('💥 Error:', err));

// Health monitoring
rpc.on('health:ok', () => console.log('💚 Connection healthy'));
rpc.on('health:degraded', (data) => console.warn('⚠️', data.message));

// Join requests
rpc.on('joinRequest', (user) => {
  console.log(`👋 ${user.username} wants to join!`);
  rpc.reply(user, 'YES'); // or 'NO' / 'IGNORE'
});

rpc.on('join', (secret) => {
  const data = rpc.parseJoinSecret(secret);
  console.log('🎮 Joining game:', data);
});
```

Metrics & Monitoring

Track performance:

```javascript
// Get stats
const stats = rpc.getStats();
console.log(`
📊 Statistics:
  Connected: ${stats.connected}
  Uptime: ${Math.floor(stats.uptime / 1000)}s
  Updates: ${stats.updateCount}
  Errors: ${stats.errorCount}
  Queue: ${stats.queueLength}
  Avg Update: ${stats.averageUpdateTime.toFixed(2)}ms
`);

// Reset metrics
rpc.resetMetrics();
```

💡 Complete Examples

Game Presence with Party System

```javascript
const createRPC = require('@s1vann/rich-presence');

class GamePresence {
  constructor() {
    this.rpc = createRPC('YOUR_CLIENT_ID', { debug: true });
    this.partyId = null;
    this.setupEvents();
  }
  
  setupEvents() {
    this.rpc.on('joinRequest', (user) => {
      console.log(`${user.username} wants to join!`);
      this.rpc.reply(user, 'YES');
    });
    
    this.rpc.on('join', (secret) => {
      const data = this.rpc.parseJoinSecret(secret);
      console.log('Joining party:', data);
    });
  }
  
  async startGame(gameName) {
    this.partyId = `party_${Date.now()}`;
    const joinSecret = this.rpc.createJoinSecret({
      partyId: this.partyId,
      game: gameName
    });
    
    await this.rpc.updatePresence({
      details: `Playing ${gameName}`,
      state: 'In Lobby',
      startTimestamp: Date.now(),
      largeImageKey: `${gameName.toLowerCase()}_logo`,
      partyId: this.partyId,
      partySize: 1,
      partyMax: 4,
      joinSecret
    });
  }
  
  async updateParty(players, maxPlayers) {
    await this.rpc.updatePresence({
      ...this.rpc.currentActivity,
      partySize: players,
      partyMax: maxPlayers
    });
  }
}

const game = new GamePresence();
await game.startGame('Among Us');
```

Music Bot Integration

```javascript
class MusicBot {
  constructor() {
    this.rpc = createRPC('YOUR_CLIENT_ID');
    this.currentSong = null;
    this.startTime = null;
  }
  
  async playSong(song, artist, duration) {
    this.currentSong = song;
    this.startTime = Date.now();
    
    await this.rpc.updatePresence({
      details: song,
      state: `by ${artist}`,
      startTimestamp: this.startTime,
      endTimestamp: this.startTime + (duration * 1000),
      largeImageKey: 'music_logo',
      smallImageKey: 'play',
      buttons: [['Listen on Spotify', `https://open.spotify.com/search/${encodeURIComponent(song)}`]]
    });
  }
  
  async pauseSong() {
    await this.rpc.updatePresence({
      details: this.currentSong,
      state: '⏸ Paused',
      smallImageKey: 'pause'
    });
  }
}

const music = new MusicBot();
await music.playSong('Bohemian Rhapsody', 'Queen', 355);
```

Discord Bot Integration

```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const createRPC = require('@s1vann/rich-presence');

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
const rpc = createRPC('YOUR_CLIENT_ID');

bot.on('ready', async () => {
  console.log(`✅ Logged in as ${bot.user.tag}`);
  
  await rpc.updatePresence({
    details: 'Managing Discord Server',
    state: `Serving ${bot.guilds.cache.size} servers`,
    largeImageKey: 'bot_logo',
    buttons: [['Invite Me', 'https://discord.com/oauth2/authorize']]
  });
});

bot.login('YOUR_BOT_TOKEN');
```

🛠️ Helper Methods

Time Helpers

```javascript
// Current timestamp
const now = rpc.elapsed();

// Timestamp for remaining time
const endTime = rpc.remaining(3600); // 1 hour from now

// Calculate progress for media
const progress = rpc.progress(120000, 355000);
// Returns: { startTimestamp: now - 120000, endTimestamp: now + 235000 }
```

Button Helper

```javascript
const buttons = rpc.buttons([
  ['Join Game', 'https://discord.gg/invite'],
  ['Watch Stream', 'https://twitch.tv/streamer']
]);
```

Asset Helper

```javascript
const assets = rpc.assets(
  'large_image_key',
  'small_image_key',
  'Large Image Text',
  'Small Image Text'
);
```

Join Secrets

```javascript
// Create secret with custom data
const secret = rpc.createJoinSecret({
  serverId: 'abc123',
  userId: 'user456',
  timestamp: Date.now()
});

// Parse secret back
const data = rpc.parseJoinSecret(secret);
```

🎯 Best Practices

Error Handling

```javascript
// Always handle errors
rpc.on('error', (err) => {
  console.error('RPC Error:', err);
  // Log to your error tracking service
});

// Try-catch for async operations
try {
  await rpc.updatePresence(activity);
} catch (err) {
  console.error('Update failed:', err.message);
}
```

Clean Shutdown

```javascript
process.on('SIGINT', () => {
  rpc.destroy();
  process.exit();
});

process.on('SIGTERM', () => {
  rpc.destroy();
  process.exit();
});
```

Rate Limiting

```javascript
// ❌ Bad - Updates 60 times per second
setInterval(() => rpc.updatePresence({ details: `Frame ${n++}` }), 16);

// ✅ Good - Use debouncing
function onFrame() {
  rpc.debouncedUpdate({ details: `Frame ${n++}` }, 'frame');
}

// ✅ Good - Reasonable interval
setInterval(() => {
  rpc.updatePresence({ details: 'Game running' });
}, 15000);
```

Development vs Production

```javascript
const rpc = createRPC('CLIENT_ID', {
  debug: process.env.NODE_ENV === 'development',
  enableMetrics: process.env.NODE_ENV === 'development'
});
```

🔧 Troubleshooting

Images Not Showing?

· ✅ Uploaded images to Discord Developer Portal?
· ✅ Image keys are case-sensitive?
· ✅ Waited up to 1 hour for new images?
· ✅ Try clearing Discord cache: Ctrl+R (Win) / Cmd+R (Mac)

Connection Issues?

```javascript
// Try different transport
const rpc = createRPC('CLIENT_ID', {
  transport: 'websocket'  // Try 'websocket' if 'ipc' fails
});

// Increase reconnect interval
const rpc = createRPC('CLIENT_ID', {
  reconnectInterval: 10000  // Try 10 seconds
});
```

Updates Not Showing?

```javascript
// Force update (bypass duplicate check)
await rpc.updatePresence(activity, { force: true });

// Check connection status
if (!rpc.connected) {
  console.log('Not connected to Discord');
}

// Clear and retry
await rpc.clearPresence();
await rpc.updatePresence(activity);
```


📄 License

MIT © s1vann

---

<div align="center">Made with ❤️ for the Discord community

Report Bug · Request Feature · Star on GitHub

</div>

