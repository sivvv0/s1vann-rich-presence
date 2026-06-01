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
