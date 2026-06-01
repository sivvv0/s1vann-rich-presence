<div align="center">

@s1vann/rich-presence

Modern Discord Rich Presence Framework

```markdown
# Discord Rich Presence Manager

A powerful, feature-rich Discord Rich Presence wrapper with auto-reconnection, queue management, middleware support, and comprehensive metrics.

## Features

- ✅ **Auto-reconnection** - Automatically reconnects when disconnected
- ✅ **Queue System** - Queues presence updates when offline
- ✅ **Middleware Support** - Transform presence data before sending
- ✅ **Debounced Updates** - Prevent rate limiting with smart throttling
- ✅ **Batch Processing** - Update multiple presences in sequence
- ✅ **Health Monitoring** - Built-in health checks with events
- ✅ **Metrics & Stats** - Track performance and errors
- ✅ **Builder Pattern** - Fluent API for creating presences
- ✅ **Templates** - Pre-built presets for common use cases
- ✅ **TypeScript Support** - Full type definitions included
- ✅ **Event Emitter** - Rich event system for all actions
- ✅ **Zero Dependencies** - Only requires discord-rpc

## Installation

```bash
npm install @s1vann/rich-presence
```

```bash
yarn add @s1vann/rich-presence
```

```bash
pnpm add @s1vann/rich-presence
```

Quick Start

```javascript
const createRPC = require('@s1vann/rich-presence');

// Initialize with your Discord Application Client ID
const rpc = createRPC('YOUR_CLIENT_ID_HERE', {
  debug: true // Enable console logs
});

// Update your presence
await rpc.updatePresence({
  details: 'Playing My Game',
  state: 'Level 5',
  startTimestamp: Date.now(),
  largeImageKey: 'game_logo'
});
```

Getting a Client ID

1. Go to Discord Developer Portal
2. Click "New Application" and name it
3. Go to "Rich Presence" → "Art Assets"
4. Upload your images (e.g., game_logo, music, youtube)
5. Copy your CLIENT_ID from the General Information page

Documentation

Initialization Options

```javascript
const rpc = createRPC('CLIENT_ID', {
  autoReconnect: true,        // Auto-reconnect on disconnect (default: true)
  reconnectInterval: 5000,    // Reconnect interval in ms (default: 5000)
  debug: false,               // Enable debug logging (default: false)
  transport: 'ipc',           // Transport method: 'ipc' or 'websocket' (default: 'ipc')
  updateThrottle: 1000,       // Debounce throttle in ms (default: 1000)
  healthCheckInterval: 30000, // Health check interval in ms (default: 30000)
  maxQueueSize: 100,          // Maximum queue size (default: 100)
  enableMetrics: true         // Enable metrics collection (default: true)
});
```

Basic Methods

updatePresence(activity, options)

Updates the Discord Rich Presence.

```javascript
await rpc.updatePresence({
  details: 'Playing Game',           // Top line
  state: 'In Menu',                  // Bottom line
  startTimestamp: Date.now(),        // Start time (shows elapsed)
  endTimestamp: Date.now() + 3600000, // End time (shows remaining)
  largeImageKey: 'game_logo',        // Large image key
  largeImageText: 'My Game',         // Hover text for large image
  smallImageKey: 'online',           // Small image key
  smallImageText: 'Online',          // Hover text for small image
  partyId: 'party123',               // Party ID for join requests
  partySize: 1,                      // Current party size
  partyMax: 4,                       // Maximum party size
  joinSecret: 'secret',              // Secret for join requests
  spectateSecret: 'spectate',        // Secret for spectate requests
  instance: true,                    // Is this an instance?
  buttons: [                         // Max 2 buttons
    { label: 'Join Game', url: 'https://discord.gg/invite' },
    { label: 'Website', url: 'https://game.com' }
  ]
}, { force: false }); // force: true to skip duplicate check
```

clearPresence()

Clears the current presence.

```javascript
await rpc.clearPresence();
```

disconnect()

Disconnects from Discord.

```javascript
rpc.disconnect();
```

destroy()

Fully destroys the instance with cleanup.

```javascript
rpc.destroy();
```

Advanced Features

Builder Pattern

Create presences using a fluent builder interface.

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

Pre-built templates for common scenarios.

```javascript
// Game template
await rpc.updatePresence(rpc.templates.game({
  name: 'Minecraft',
  state: 'Survival Mode',
  partySize: 2,
  partyMax: 8,
  startTime: Date.now(),
  largeImage: 'minecraft_logo'
}));

// Music template
await rpc.updatePresence(rpc.templates.music({
  song: 'Bohemian Rhapsody',
  artist: 'Queen',
  album: 'A Night at the Opera',
  largeImage: 'music_logo'
}));

// Movie template
await rpc.updatePresence(rpc.templates.movie({
  title: 'Inception',
  episode: '2',
  largeImage: 'movie_logo'
}));

// Custom template
await rpc.updatePresence(rpc.templates.custom({
  details: 'Custom Activity',
  state: 'Custom State'
}));
```

Presets

Ready-to-use presets for popular apps.

```javascript
// YouTube preset
await rpc.updatePresence(rpc.presets.youtube('Amazing Cat Video'));

// Netflix preset
await rpc.updatePresence(rpc.presets.netflix('Stranger Things'));

// Spotify preset
await rpc.updatePresence(rpc.presets.spotify({
  song: 'Blinding Lights',
  artist: 'The Weeknd',
  album: 'After Hours'
}));

// VS Code preset
await rpc.updatePresence(rpc.presets.vscode({
  file: 'app.js',
  project: 'My Project'
}));

// Gaming preset
await rpc.updatePresence(rpc.presets.gaming('Cyberpunk 2077', 5));
```

Middleware

Transform presence data before it's sent.

```javascript
// Add timestamp to all presences
rpc.use(async (activity, ctx) => {
  if (!activity.startTimestamp && !activity.endTimestamp) {
    activity.startTimestamp = Date.now();
  }
  return activity;
});

// Log all updates
rpc.use(async (activity, ctx) => {
  console.log(`Updating presence: ${activity.details}`);
  return activity;
});

// Validate buttons
rpc.use(async (activity, ctx) => {
  if (activity.buttons && activity.buttons.length > 2) {
    activity.buttons = activity.buttons.slice(0, 2);
  }
  return activity;
});
```

Queue System

Automatically queues updates when offline.

```javascript
// Check queue status
const queueSize = rpc.getQueueSize();
console.log(`Queue size: ${queueSize}`);

// Manually queue an update
rpc.queuePresence({ details: 'Queued presence' });

// Clear the queue
const cleared = rpc.clearQueue();
console.log(`Cleared ${cleared} items from queue`);

// Queue events
rpc.on('queue:overflow', ({ dropped }) => {
  console.warn('Queue overflow! Updates being dropped');
});
```

Debounced Updates

Prevent rate limiting during rapid updates.

```javascript
// Perfect for typing indicators or rapid state changes
async function onTyping() {
  await rpc.debouncedUpdate({
    details: 'User is typing...'
  }, 'typing'); // Unique key for this debouncer
}

// Called 100 times rapidly - only updates once per second
for (let i = 0; i < 100; i++) {
  onTyping();
}
```

Batch Updates

Update multiple presences in sequence.

```javascript
const results = await rpc.updateBatch([
  { details: 'Loading...', largeImageKey: 'loading' },
  { details: 'In Game', state: 'Playing', largeImageKey: 'game' },
  { details: 'Menu', state: 'Idle', largeImageKey: 'menu' }
]);

results.forEach(result => {
  if (result.success) {
    console.log('Updated successfully:', result.activity);
  } else {
    console.error('Update failed:', result.error);
  }
});
```

Timeout Protection

Prevent hanging updates.

```javascript
try {
  await rpc.updatePresenceWithTimeout(activity, 5000);
} catch (err) {
  console.error('Update timed out after 5 seconds');
}
```

Helper Methods

Time Helpers

```javascript
// Get current timestamp
const now = rpc.elapsed();

// Get timestamp for remaining time
const endTime = rpc.remaining(3600); // 1 hour from now

// Calculate progress for media
const progress = rpc.progress(
  120000, // Current position (2 minutes)
  355000  // Total duration (5 minutes 55 seconds)
);
// Returns: { startTimestamp: now - 120000, endTimestamp: now + 235000 }
```

Button Helper

```javascript
const buttons = rpc.buttons([
  ['Join Game', 'https://discord.gg/invite'],
  ['Watch Stream', 'https://twitch.tv/streamer']
]);
// Returns properly formatted button array
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

Join/spectate Secrets

```javascript
// Create a secret with custom data
const secret = rpc.createJoinSecret({
  serverId: 'abc123',
  userId: 'user456',
  timestamp: Date.now()
});

// Parse the secret back
const data = rpc.parseJoinSecret(secret);
console.log(data.serverId, data.userId);
```

Quick Presence Methods

```javascript
// Set playing status
await rpc.setPlaying('Minecraft');

// Set watching status
await rpc.setWatching('Netflix');

// Set listening status
await rpc.setListening('Spotify');

// Set streaming status
await rpc.setStreaming('Twitch Stream', 'https://twitch.tv/streamer');
```

Events

Listen to various events emitted by the client.

```javascript
// Connection events
rpc.on('connected', () => {
  console.log('Connected to Discord');
});

rpc.on('disconnected', () => {
  console.log('Disconnected from Discord');
});

// Error events
rpc.on('error', (err) => {
  console.error('RPC Error:', err);
});

// Health events
rpc.on('health:ok', () => {
  console.log('Connection healthy');
});

rpc.on('health:degraded', (data) => {
  console.warn(`Health degraded: ${data.message}`);
});

// Update events
rpc.on('update:success', (activity) => {
  console.log('Presence updated successfully', activity);
});

// Activity events (for join requests)
rpc.on('join', (secret) => {
  console.log('User wants to join game', secret);
  // Connect user to your game
});

rpc.on('spectate', (secret) => {
  console.log('User wants to spectate', secret);
});

rpc.on('joinRequest', (user) => {
  console.log(`${user.username} requested to join`);
  
  // Accept or deny the request
  rpc.reply(user, 'YES'); // or 'NO' / 'IGNORE'
});
```

Metrics & Statistics

Monitor your RPC client's performance.

```javascript
// Get current stats
const stats = rpc.getStats();
console.log({
  connected: stats.connected,
  uptime: `${Math.floor(stats.uptime / 1000)}s`,
  updateCount: stats.updateCount,
  errorCount: stats.errorCount,
  queueLength: stats.queueLength,
  averageUpdateTime: `${stats.averageUpdateTime.toFixed(2)}ms`,
  reconnectCount: stats.reconnectCount
});

// Reset metrics
rpc.resetMetrics();
```

Error Handling

Always handle errors appropriately.

```javascript
try {
  await rpc.updatePresence(activity);
} catch (err) {
  if (err.message.includes('timeout')) {
    console.error('Update timed out');
  } else if (err.message.includes('buttons')) {
    console.error('Button validation failed');
  } else {
    console.error('Unknown error:', err);
  }
}

// Global error handler
rpc.on('error', (err) => {
  // Don't crash your app
  console.error('RPC Error:', err);
});
```

Complete Examples

Example 1: Game Presence with Party System

```javascript
const createRPC = require('your-package-name');

class GamePresence {
  constructor() {
    this.rpc = createRPC('YOUR_CLIENT_ID', { debug: true });
    this.partyId = null;
    this.setupEvents();
  }
  
  setupEvents() {
    this.rpc.on('connected', () => {
      console.log('Discord connected!');
    });
    
    this.rpc.on('joinRequest', (user) => {
      console.log(`${user.username} wants to join!`);
      // Auto-accept
      this.rpc.reply(user, 'YES');
    });
    
    this.rpc.on('join', (secret) => {
      const data = this.rpc.parseJoinSecret(secret);
      console.log('Joining party:', data);
      this.joinParty(data);
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
      joinSecret: joinSecret,
      buttons: [['Join Party', 'https://discord.gg/invite']]
    });
  }
  
  async updateParty(players, maxPlayers) {
    await this.rpc.updatePresence({
      ...this.rpc.currentActivity,
      partySize: players,
      partyMax: maxPlayers
    });
  }
  
  joinParty(data) {
    console.log(`Joining ${data.game} party: ${data.partyId}`);
    // Implement party joining logic
  }
}

const presence = new GamePresence();
await presence.startGame('Among Us');
```

Example 2: Music Bot

```javascript
const createRPC = require('your-package-name');

class MusicBot {
  constructor() {
    this.rpc = createRPC('YOUR_CLIENT_ID');
    this.currentSong = null;
    this.startTime = null;
  }
  
  async playSong(song, artist, duration, albumArt) {
    this.currentSong = song;
    this.startTime = Date.now();
    
    await this.rpc.updatePresence({
      details: song,
      state: `by ${artist}`,
      startTimestamp: this.startTime,
      endTimestamp: this.startTime + (duration * 1000),
      largeImageKey: albumArt || 'music_logo',
      smallImageKey: 'play',
      buttons: [
        ['Listen on Spotify', `https://open.spotify.com/search/${encodeURIComponent(song)}`],
        ['Join Party', 'https://discord.gg/music']
      ]
    });
  }
  
  async pauseSong() {
    const elapsed = (Date.now() - this.startTime) / 1000;
    await this.rpc.updatePresence({
      details: this.currentSong,
      state: '⏸ Paused',
      largeImageKey: 'music_logo',
      smallImageKey: 'pause'
    });
  }
  
  async resumeSong() {
    await this.rpc.updatePresence({
      details: this.currentSong,
      state: '▶ Playing',
      startTimestamp: Date.now() - (this.pausedAt || 0),
      largeImageKey: 'music_logo',
      smallImageKey: 'play'
    });
  }
  
  async stopSong() {
    await this.rpc.clearPresence();
    this.currentSong = null;
    this.startTime = null;
  }
}

const musicBot = new MusicBot();
await musicBot.playSong('Bohemian Rhapsody', 'Queen', 355, 'queen_logo');
```

Example 3: VS Code Extension

```javascript
const createRPC = require('your-package-name');
const vscode = require('vscode');

class VSCodePresence {
  constructor() {
    this.rpc = createRPC('YOUR_CLIENT_ID');
    this.currentFile = null;
    this.startTime = null;
    this.languageMap = {
      'javascript': 'JS',
      'typescript': 'TS',
      'python': '🐍 Python',
      'cpp': 'C++'
    };
  }
  
  async onFileOpen(document) {
    this.currentFile = document.fileName.split('/').pop();
    this.startTime = Date.now();
    const lang = this.languageMap[document.languageId] || document.languageId;
    
    await this.rpc.updatePresence({
      details: `Editing ${this.currentFile}`,
      state: lang,
      startTimestamp: this.startTime,
      largeImageKey: 'vscode',
      largeImageText: 'Visual Studio Code',
      smallImageKey: 'code',
      smallImageText: lang,
      buttons: [['Open in VS Code', 'vscode://file']]
    });
  }
  
  async onFileSave() {
    await this.rpc.debouncedUpdate({
      details: `Saving ${this.currentFile}`,
      state: 'Saved successfully ✓',
      startTimestamp: Date.now()
    }, 'save');
  }
  
  async onDebugStart() {
    await this.rpc.updatePresence({
      details: `Debugging ${this.currentFile}`,
      state: '🐛 Debug mode',
      startTimestamp: Date.now(),
      smallImageKey: 'debug'
    });
  }
  
  getStats() {
    return this.rpc.getStats();
  }
  
  dispose() {
    this.rpc.destroy();
  }
}

// In your extension activation
const presence = new VSCodePresence();
vscode.workspace.onDidOpenTextDocument(doc => presence.onFileOpen(doc));
vscode.workspace.onDidSaveTextDocument(doc => presence.onFileSave());
```

Example 4: Web Application

```javascript
// For browser environment
import createRPC from 'your-package-name/browser';

class WebAppPresence {
  constructor() {
    this.rpc = createRPC('YOUR_CLIENT_ID');
    this.sessionId = this.generateSessionId();
  }
  
  async onPageView(pageName) {
    await this.rpc.updatePresence({
      details: `Browsing: ${pageName}`,
      state: document.title,
      startTimestamp: Date.now(),
      largeImageKey: 'website_logo',
      largeImageText: window.location.hostname,
      buttons: [['Visit Website', window.location.href]]
    });
  }
  
  async onVideoPlay(videoTitle, duration) {
    await this.rpc.updatePresence({
      details: `Watching: ${videoTitle}`,
      state: '🎬 Playing',
      startTimestamp: Date.now(),
      endTimestamp: Date.now() + (duration * 1000),
      largeImageKey: 'video_player',
      smallImageKey: 'play',
      buttons: [['Watch Now', window.location.href]]
    });
  }
  
  async onLogin(userName) {
    await this.rpc.updatePresence({
      details: `Logged in as ${userName}`,
      state: 'Online',
      largeImageKey: 'user_online'
    });
  }
  
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36);
  }
}

// Usage
const webPresence = new WebAppPresence();
webPresence.onPageView('Home Page');

// Track video playback
const video = document.querySelector('video');
video.addEventListener('play', () => {
  webPresence.onVideoPlay('Awesome Video', video.duration);
});
```

Best Practices

1. Always Handle Errors

```javascript
rpc.on('error', (err) => {
  console.error('RPC Error:', err);
  // Log to your error tracking service
  // Don't crash your application
});
```

2. Clean Up on Exit

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

3. Don't Update Too Frequently

```javascript
// Bad - Updates 60 times per second
setInterval(() => {
  rpc.updatePresence({ details: 'Frame ' + frameCount++ });
}, 16);

// Good - Use debouncing for rapid changes
function onFrame() {
  rpc.debouncedUpdate({ details: 'Frame ' + frameCount++ }, 'frame');
}

// Good - Update at reasonable intervals
setInterval(() => {
  rpc.updatePresence({ details: 'Game running' });
}, 15000); // Every 15 seconds
```

4. Use Debug Mode in Development

```javascript
const rpc = createRPC('CLIENT_ID', {
  debug: process.env.NODE_ENV === 'development',
  enableMetrics: process.env.NODE_ENV === 'development'
});
```

5. Validate Image Keys

```javascript
// Make sure your image keys are uploaded to Discord Developer Portal
const validImages = ['game_logo', 'music', 'youtube', 'vscode'];

async function safeUpdatePresence(activity) {
  if (activity.largeImageKey && !validImages.includes(activity.largeImageKey)) {
    console.warn(`Invalid image key: ${activity.largeImageKey}`);
    delete activity.largeImageKey;
  }
  await rpc.updatePresence(activity);
}
```

6. Handle Disconnections Gracefully

```javascript
rpc.on('disconnected', () => {
  console.log('Discord disconnected - queuing updates');
  // Show offline indicator in your UI
  showOfflineBadge();
});

rpc.on('connected', () => {
  console.log('Discord reconnected');
  hideOfflineBadge();
});
```

7. Monitor Performance in Production

```javascript
setInterval(() => {
  const stats = rpc.getStats();
  
  if (stats.errorCount > 10) {
    console.error('Too many RPC errors:', stats.errorCount);
    // Alert your monitoring system
  }
  
  if (stats.queueLength > 50) {
    console.warn('Large queue detected:', stats.queueLength);
  }
}, 60000); // Check every minute
```

Troubleshooting

Images not showing?

1. Make sure you uploaded images to Discord Developer Portal
2. Image keys are case-sensitive
3. It may take up to an hour for new images to appear
4. Clear Discord cache: Ctrl+R (Windows) or Cmd+R (Mac)

Connection Issues?

```javascript
// Try different transport
const rpc = createRPC('CLIENT_ID', {
  transport: 'websocket' // Try 'ipc' if 'websocket' fails
});

// Increase reconnect interval
const rpc = createRPC('CLIENT_ID', {
  autoReconnect: true,
  reconnectInterval: 10000 // Try 10 seconds
});
```

Updates not showing?

```javascript
// Force update even if same as current
await rpc.updatePresence(activity, { force: true });

// Check if connected
if (!rpc.connected) {
  console.log('Not connected to Discord');
}

// Clear and reset
await rpc.clearPresence();
await rpc.updatePresence(activity);
```

API Reference

Constructor Options

Option Type Default Description
autoReconnect boolean true Auto-reconnect on disconnect
reconnectInterval number 5000 Reconnect interval (ms)
debug boolean false Enable debug logging
transport string 'ipc' Transport method ('ipc' or 'websocket')
updateThrottle number 1000 Debounce throttle (ms)
healthCheckInterval number 30000 Health check interval (ms)
maxQueueSize number 100 Maximum queue size
enableMetrics boolean true Enable metrics collection

Methods

Method Description
updatePresence(activity, options) Update Discord presence
clearPresence() Clear current presence
disconnect() Disconnect from Discord
destroy() Destroy instance with cleanup
queuePresence(activity) Queue presence for later
getQueueSize() Get current queue size
clearQueue() Clear all queued presences
debouncedUpdate(activity, key) Update with debouncing
updateBatch(activities) Update multiple presences
updatePresenceWithTimeout(activity, timeout) Update with timeout
use(middleware) Add middleware
getStats() Get metrics statistics
resetMetrics() Reset all metrics
reconnect() Manually reconnect
createPresence() Create PresenceBuilder instance
reply(user, response) Reply to join request

Events

Event Description
connected Connected to Discord
disconnected Disconnected from Discord
error Error occurred
health:ok Connection healthy
health:degraded Health check failed
update:success Presence updated
queue:overflow Queue size exceeded
join User wants to join
spectate User wants to spectate
joinRequest User requested to join

Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

License

MIT © s1vann

Support

· 📖 Documentation
· 🐛 Issue Tracker
· 💬 Discord Server

---

Made with ❤️ for the Discord community

```

</div>

