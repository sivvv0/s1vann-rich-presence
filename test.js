const createRPC = require('@s1vann/rich-presence');
const rpc = createRPC('CLIENT_ID', {
  debug: true,
  autoReconnect: true
});
rpc.on('connected', async () => {
  console.log('Connected');
  await rpc.updatePresence({
    details: 'Watching Anime',
    state: 'Episode 5',
    largeImageKey: 'anime',
    startTimestamp: Date.now(),
    buttons: rpc.buttons([
      ['Website', 'https://example.com']
    ])
  });
});
