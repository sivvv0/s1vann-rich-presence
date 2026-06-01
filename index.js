'use strict';

const DiscordRPC = require('discord-rpc');
const { EventEmitter } = require('events');

// TypeScript definitions would go in a separate .d.ts file
class PresenceBuilder {
  constructor() {
    this.data = {};
  }
  
  setDetails(details) { 
    this.data.details = details; 
    return this; 
  }
  
  setState(state) { 
    this.data.state = state; 
    return this; 
  }
  
  setTimestamps(start, end) { 
    this.data.startTimestamp = start;
    this.data.endTimestamp = end;
    return this;
  }
  
  setAssets(large, small = null, largeText = null, smallText = null) {
    this.data.largeImageKey = large;
    if (small) this.data.smallImageKey = small;
    if (largeText) this.data.largeImageText = largeText;
    if (smallText) this.data.smallImageText = smallText;
    return this;
  }
  
  setParty(partyId, size, max) {
    this.data.partyId = partyId;
    this.data.partySize = size;
    this.data.partyMax = max;
    return this;
  }
  
  setSecrets(join, spectate) {
    if (join) this.data.joinSecret = join;
    if (spectate) this.data.spectateSecret = spectate;
    return this;
  }
  
  setButtons(buttons) { 
    this.data.buttons = buttons; 
    return this; 
  }
  
  setInstance(instance = true) {
    this.data.instance = instance;
    return this;
  }
  
  build() { 
    return { ...this.data }; 
  }
}

class RichPresence extends EventEmitter {
  constructor(clientId, options = {}) {
    super();
    if (!clientId) {
      throw new Error('clientId is required');
    }
    
    this.clientId = clientId;
    this.options = {
      autoReconnect: true,
      reconnectInterval: 5000,
      debug: false,
      transport: 'ipc',
      updateThrottle: 1000,
      healthCheckInterval: 30000,
      maxQueueSize: 100,
      enableMetrics: true,
      ...options
    };
    
    this.rpc = null;
    this.connected = false;
    this.currentActivity = null;
    this.queue = [];
    this.middlewares = [];
    this.debounceTimers = new Map();
    this.heartbeatInterval = null;
    this.lastHeartbeat = null;
    this.connectTime = null;
    
    // Metrics
    this.metrics = {
      updateCount: 0,
      errorCount: 0,
      queueDropped: 0,
      reconnectCount: 0,
      lastError: null,
      averageUpdateTime: 0,
      updateTimes: []
    };
    
    this._connect();
  }
  
  // Logging
  log(...args) {
    if (this.options.debug) {
      console.log('[RichPresence]', ...args);
    }
  }
  
  // Delay utility
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Connection
  async _connect() {
    try {
      DiscordRPC.register(this.clientId);
      this.rpc = new DiscordRPC.Client({
        transport: this.options.transport
      });
      
      this.rpc.on('ready', async () => {
        this.connected = true;
        this.connectTime = Date.now();
        this.lastHeartbeat = Date.now();
        this.log('Connected to Discord');
        this.emit('connected');
        
        if (this.currentActivity) {
          await this.rpc.setActivity(this.currentActivity);
        }
        
        this._flushQueue();
        this.startHealthCheck();
      });
      
      this.rpc.on('disconnected', () => {
        this.connected = false;
        this.log('Disconnected');
        this.emit('disconnected');
        this.stopHealthCheck();
        
        if (this.options.autoReconnect) {
          this.metrics.reconnectCount++;
          setTimeout(() => {
            this._connect();
          }, this.options.reconnectInterval);
        }
      });
      
      this.rpc.on('error', (err) => {
        this.metrics.errorCount++;
        this.metrics.lastError = err;
        this.emit('error', err);
      });
      
      this.rpc.on('ACTIVITY_JOIN', ({ secret }) => {
        this.emit('join', secret);
      });
      
      this.rpc.on('ACTIVITY_SPECTATE', ({ secret }) => {
        this.emit('spectate', secret);
      });
      
      this.rpc.on('ACTIVITY_JOIN_REQUEST', (user) => {
        this.emit('joinRequest', user);
      });
      
      await this.rpc.login({
        clientId: this.clientId
      });
    } catch (err) {
      this.metrics.errorCount++;
      this.metrics.lastError = err;
      this.emit('error', err);
      
      if (this.options.autoReconnect) {
        this.metrics.reconnectCount++;
        setTimeout(() => {
          this._connect();
        }, this.options.reconnectInterval);
      }
    }
  }
  
  // Health check
  startHealthCheck() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    
    this.heartbeatInterval = setInterval(() => {
      if (this.connected) {
        const now = Date.now();
        if (this.lastHeartbeat && (now - this.lastHeartbeat) > this.options.healthCheckInterval) {
          this.emit('health:degraded', { 
            lastHeartbeat: this.lastHeartbeat,
            message: 'No heartbeat detected'
          });
          
          if (this.options.autoReconnect) {
            this.log('Health check failed, reconnecting...');
            this.reconnect();
          }
        } else {
          this.lastHeartbeat = now;
          this.emit('health:ok');
        }
      }
    }, this.options.healthCheckInterval);
  }
  
  stopHealthCheck() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  async reconnect() {
    this.log('Manual reconnection requested');
    this.disconnect();
    await this.delay(1000);
    await this._connect();
  }
  
  // Queue management
  async _flushQueue() {
    while (this.queue.length > 0) {
      const activity = this.queue.shift();
      try {
        await this.rpc.setActivity(activity);
        this.metrics.updateCount++;
      } catch (err) {
        this.metrics.errorCount++;
        this.emit('error', err);
      }
      await this.delay(100); // Rate limiting between queue items
    }
  }
  
  // Validation
  validate(activity) {
    if (!activity || typeof activity !== 'object') {
      throw new TypeError('Activity must be an object');
    }
    
    // Validate buttons if present
    if (activity.buttons && activity.buttons.length > 2) {
      throw new Error('Maximum 2 buttons allowed');
    }
    
    if (activity.buttons) {
      for (const button of activity.buttons) {
        if (!button.label || !button.url) {
          throw new Error('Each button must have label and url');
        }
        if (button.label.length > 32) {
          throw new Error('Button label cannot exceed 32 characters');
        }
      }
    }
    
    return true;
  }
  
  // Activity comparison
  isSameActivity(newActivity) {
    if (!this.currentActivity) return false;
    
    // Remove timestamps from comparison if they're within 1 second
    const current = { ...this.currentActivity };
    const newAct = { ...newActivity };
    
    delete current.startTimestamp;
    delete current.endTimestamp;
    delete newAct.startTimestamp;
    delete newAct.endTimestamp;
    
    return JSON.stringify(current) === JSON.stringify(newAct);
  }
  
  // Middleware system
  use(middleware) {
    if (typeof middleware !== 'function') {
      throw new TypeError('Middleware must be a function');
    }
    this.middlewares.push(middleware);
    return this; // For chaining
  }
  
  // Debounced update
  debouncedUpdate(activity, key = 'default') {
    return new Promise((resolve, reject) => {
      if (this.debounceTimers.has(key)) {
        clearTimeout(this.debounceTimers.get(key));
      }
      
      const timer = setTimeout(async () => {
        try {
          await this.updatePresence(activity);
          this.debounceTimers.delete(key);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, this.options.updateThrottle);
      
      this.debounceTimers.set(key, timer);
    });
  }
  
  // Update with timeout
  async updatePresenceWithTimeout(activity, timeout = 5000) {
    return Promise.race([
      this.updatePresence(activity),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Update timeout')), timeout)
      )
    ]);
  }
  
  // Main update method
  async updatePresence(activity, options = { force: false }) {
    const startTime = Date.now();
    
    this.validate(activity);
    
    // Apply middlewares
    let processedActivity = activity;
    for (const middleware of this.middlewares) {
      processedActivity = await middleware(processedActivity, this);
    }
    
    // Skip if same as current and not forced
    if (!options.force && this.isSameActivity(processedActivity)) {
      this.log('Skipping duplicate presence update');
      return;
    }
    
    this.currentActivity = processedActivity;
    
    if (!this.connected) {
      if (this.queue.length >= this.options.maxQueueSize) {
        this.metrics.queueDropped++;
        this.emit('queue:overflow', { dropped: true });
        return;
      }
      this.queue.push(processedActivity);
      this.log('Queued presence update');
      return;
    }
    
    try {
      await this.rpc.setActivity(processedActivity);
      this.log('Presence updated');
      
      // Update metrics
      if (this.options.enableMetrics) {
        this.metrics.updateCount++;
        const updateTime = Date.now() - startTime;
        this.metrics.updateTimes.push(updateTime);
        
        // Keep last 100 update times
        if (this.metrics.updateTimes.length > 100) {
          this.metrics.updateTimes.shift();
        }
        
        this.metrics.averageUpdateTime = 
          this.metrics.updateTimes.reduce((a, b) => a + b, 0) / this.metrics.updateTimes.length;
      }
      
      this.lastHeartbeat = Date.now();
      this.emit('update:success', processedActivity);
    } catch (err) {
      this.metrics.errorCount++;
      this.metrics.lastError = err;
      this.emit('error', err);
      throw err;
    }
  }
  
  // Batch updates
  async updateBatch(activities) {
    const results = [];
    for (const activity of activities) {
      try {
        await this.updatePresence(activity);
        results.push({ success: true, activity });
      } catch (err) {
        results.push({ success: false, activity, error: err });
      }
      await this.delay(100); // Rate limit protection
    }
    return results;
  }
  
  // Queue management
  queuePresence(activity) {
    if (this.queue.length >= this.options.maxQueueSize) {
      this.metrics.queueDropped++;
      throw new Error(`Queue full (max: ${this.options.maxQueueSize})`);
    }
    this.queue.push(activity);
    return this.queue.length;
  }
  
  getQueueSize() {
    return this.queue.length;
  }
  
  clearQueue() {
    const cleared = this.queue.length;
    this.queue = [];
    return cleared;
  }
  
  // Presence management
  async clearPresence() {
    if (!this.connected) return;
    await this.rpc.clearActivity();
    this.currentActivity = null;
    this.log('Presence cleared');
  }
  
  // Templates with validation
  templates = {
    game: ({ name, state, partySize, partyMax, startTime, endTime, largeImage = 'game_icon' }) => {
      if (!name) throw new Error('Game name required');
      return {
        details: name,
        state: state || 'In Game',
        startTimestamp: startTime || Date.now(),
        endTimestamp: endTime,
        partySize,
        partyMax,
        largeImageKey: largeImage
      };
    },
    
    movie: ({ title, episode, largeImage = 'movie' }) => {
      if (!title) throw new Error('Movie title required');
      return {
        details: title,
        state: episode ? `Episode ${episode}` : 'Watching',
        largeImageKey: largeImage
      };
    },
    
    music: ({ song, artist, album, largeImage = 'music' }) => {
      if (!song) throw new Error('Song name required');
      return {
        details: song,
        state: artist ? `by ${artist}` : 'Listening',
        largeImageKey: largeImage,
        smallImageKey: album ? 'album' : null
      };
    },
    
    custom: (config) => {
      if (!config.details) throw new Error('Custom presence requires details');
      return config;
    }
  };
  
  // Helper methods
  elapsed() {
    return Date.now();
  }
  
  remaining(seconds) {
    return Date.now() + seconds * 1000;
  }
  
  progress(current, total) {
    const now = Date.now();
    return {
      startTimestamp: now - current,
      endTimestamp: now + (total - current)
    };
  }
  
  buttons(buttons = []) {
    if (buttons.length > 2) {
      throw new Error('Maximum 2 buttons allowed');
    }
    return buttons.map(([label, url]) => ({
      label: label.slice(0, 32),
      url
    }));
  }
  
  assets(large, small = null, largeText = null, smallText = null) {
    const assetsObj = { largeImageKey: large };
    if (small) assetsObj.smallImageKey = small;
    if (largeText) assetsObj.largeImageText = largeText;
    if (smallText) assetsObj.smallImageText = smallText;
    return assetsObj;
  }
  
  createJoinSecret(data) {
    return Buffer.from(JSON.stringify(data)).toString('base64');
  }
  
  parseJoinSecret(secret) {
    return JSON.parse(Buffer.from(secret, 'base64').toString());
  }
  
  // Quick presence methods
  async setPlaying(name) {
    return this.updatePresence({
      details: `Playing ${name}`,
      largeImageKey: 'game'
    });
  }
  
  async setWatching(name) {
    return this.updatePresence({
      details: `Watching ${name}`,
      largeImageKey: 'watch'
    });
  }
  
  async setListening(name) {
    return this.updatePresence({
      details: `Listening to ${name}`,
      largeImageKey: 'music'
    });
  }
  
  async setStreaming(name, url) {
    return this.updatePresence({
      details: `Streaming ${name}`,
      url,
      largeImageKey: 'stream'
    });
  }
  
  // Built-in presets
  presets = {
    netflix: (title) => ({
      details: title || 'Watching Netflix',
      state: title ? `Now watching: ${title}` : 'Browsing',
      largeImageKey: 'netflix',
      largeImageText: 'Netflix'
    }),
    
    youtube: (videoTitle) => ({
      details: videoTitle || 'Watching YouTube',
      state: videoTitle ? `🎬 ${videoTitle}` : 'Browsing videos',
      largeImageKey: 'youtube',
      largeImageText: 'YouTube',
      buttons: [['Watch on YouTube', 'https://youtube.com']]
    }),
    
    spotify: ({ song, artist, album }) => ({
      details: song || 'Listening to Spotify',
      state: artist ? `by ${artist}` : 'Music',
      largeImageKey: 'spotify',
      largeImageText: album || 'Spotify',
      smallImageKey: 'play'
    }),
    
    vscode: ({ file, project }) => ({
      details: file ? `Editing ${file}` : 'Coding',
      state: project || 'Visual Studio Code',
      largeImageKey: 'vscode',
      largeImageText: 'VS Code',
      smallImageKey: 'code'
    }),
    
    gaming: (game, level = null) => ({
      details: `Playing ${game}`,
      state: level ? `Level ${level}` : 'In game',
      largeImageKey: 'game',
      largeImageText: game,
      startTimestamp: Date.now()
    })
  };
  
  // Interaction methods
  reply(user, response) {
    switch (response) {
      case 'YES':
        return this.rpc.sendJoinInvite(user);
      case 'NO':
      case 'IGNORE':
        return this.rpc.closeJoinRequest(user);
      default:
        throw new Error('Invalid response. Use "YES", "NO", or "IGNORE"');
    }
  }
  
  // Metrics
  getStats() {
    if (!this.options.enableMetrics) {
      return { message: 'Metrics disabled. Enable with enableMetrics: true' };
    }
    
    return {
      connected: this.connected,
      queueLength: this.queue.length,
      queueMaxSize: this.options.maxQueueSize,
      queueDropped: this.metrics.queueDropped,
      uptime: this.connected && this.connectTime ? Date.now() - this.connectTime : 0,
      updateCount: this.metrics.updateCount,
      errorCount: this.metrics.errorCount,
      reconnectCount: this.metrics.reconnectCount,
      averageUpdateTime: this.metrics.averageUpdateTime,
      lastError: this.metrics.lastError ? this.metrics.lastError.message : null,
      middlewaresCount: this.middlewares.length
    };
  }
  
  resetMetrics() {
    this.metrics = {
      updateCount: 0,
      errorCount: 0,
      queueDropped: 0,
      reconnectCount: 0,
      lastError: null,
      averageUpdateTime: 0,
      updateTimes: []
    };
  }
  
  // Disconnect
  disconnect() {
    this.stopHealthCheck();
    
    // Clear all timers
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
    
    if (this.rpc) {
      this.rpc.destroy();
    }
    
    this.connected = false;
    this.log('Disconnected manually');
    this.emit('disconnected');
  }
  
  // Builder pattern helper
  createPresence() {
    return new PresenceBuilder();
  }
  
  // Destroy with cleanup
  destroy() {
    this.disconnect();
    this.removeAllListeners();
    this.queue = [];
    this.middlewares = [];
  }
}

// Factory function
function createRPC(clientId, options = {}) {
  return new RichPresence(clientId, options);
}

// Export builder as well
createRPC.PresenceBuilder = PresenceBuilder;

module.exports = createRPC;
