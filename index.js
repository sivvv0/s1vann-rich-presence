'use strict';

const DiscordRPC = require('discord-rpc');
const { EventEmitter } = require('events');
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
      ...options
    };
    this.rpc = null;
    this.connected = false;
    this.currentActivity = null;
    this.queue = [];
    this._connect();
  }
  log(...args) {
    if (this.options.debug) {
      console.log('[RichPresence]', ...args);
    }
  }
  async _connect() {
    try {
      DiscordRPC.register(this.clientId);
      this.rpc = new DiscordRPC.Client({
        transport: this.options.transport
      });
      this.rpc.on('ready', async () => {
        this.connected = true;
        this.log('Connected to Discord');
        this.emit('connected');
        if (this.currentActivity) {
          await this.rpc.setActivity(this.currentActivity);
        }
        this._flushQueue();
      });
      this.rpc.on('disconnected', () => {
        this.connected = false;
        this.log('Disconnected');
        this.emit('disconnected');
        if (this.options.autoReconnect) {
          setTimeout(() => {
            this._connect();
          }, this.options.reconnectInterval);
        }
      });
      this.rpc.on('error', (err) => {
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
      this.emit('error', err);
      if (this.options.autoReconnect) {
        setTimeout(() => {
          this._connect();
        }, this.options.reconnectInterval);
      }
    }
  }
  async _flushQueue() {
    while (this.queue.length > 0) {
      const activity = this.queue.shift();
      try {
        await this.rpc.setActivity(activity);
      } catch (err) {
        this.emit('error', err);
      }
    }
  }
  validate(activity) {
    if (!activity || typeof activity !== 'object') {
      throw new TypeError('Activity must be an object');
    }
    return true;
  }
  async updatePresence(activity) {
    this.validate(activity);
    this.currentActivity = activity;
    if (!this.connected) {
      this.queue.push(activity);
      return;
    }
    try {
      await this.rpc.setActivity(activity);
      this.log('Presence updated');
    } catch (err) {
      this.emit('error', err);
    }
  }
  queuePresence(activity) {
    this.queue.push(activity);
  }
  async clearPresence() {
    if (!this.connected) return;
    await this.rpc.clearActivity();
  }
  disconnect() {
    if (this.rpc) {
      this.rpc.destroy();
    }
    this.connected = false;
  }
  reply(user, response) {
    switch (response) {
      case 'YES':
        return this.rpc.sendJoinInvite(user);
      case 'NO':
      case 'IGNORE':
        return this.rpc.closeJoinRequest(user);
      default:
        throw new Error('Invalid response');
    }
  }
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
    return buttons.map(([label, url]) => ({
      label,
      url
    }));
  }
  assets(large, small = null) {
    return {
      largeImageKey: large,
      smallImageKey: small
    };
  }
  createJoinSecret(data) {
    return Buffer.from(JSON.stringify(data)).toString('base64');
  }
  parseJoinSecret(secret) {
    return JSON.parse(
      Buffer.from(secret, 'base64').toString()
    );
  }
  async setPlaying(name) {
    return this.updatePresence({
      details: `Playing ${name}`
    });
  }
  async setWatching(name) {
    return this.updatePresence({
      details: `Watching ${name}`
    });
  }
  async setListening(name) {
    return this.updatePresence({
      details: `Listening to ${name}`
    });
  }
  async setStreaming(name, url) {
    return this.updatePresence({
      details: `Streaming ${name}`,
      url
    });
  }
  presets = {
    netflix: () => ({
      details: 'Watching Netflix',
      largeImageKey: 'netflix'
    }),
    youtube: () => ({
      details: 'Watching YouTube',
      largeImageKey: 'youtube'
    }),
    vscode: () => ({
      details: 'Coding',
      state: 'Visual Studio Code',
      largeImageKey: 'vscode'
    }),
    gaming: (game) => ({
      details: `Playing ${game}`,
      largeImageKey: 'game'
    })
  };
}
function createRPC(clientId, options = {}) {
  return new RichPresence(clientId, options);
}
module.exports = createRPC;
