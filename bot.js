// ===== Required =====
const mineflayer = require('mineflayer');
const express = require('express');

// ===== Simple HTTP server (IMPORTANT for Railway) =====
const app = express();
app.get('/', (req, res) => {
  res.send('AFK BOT IS RUNNING');
});
app.listen(process.env.PORT || 3000, () => {
  console.log('🌐 Web server ready');
});

// ===== Bot Configuration =====
const config = {
  host: 'adamaad.aternos.me',
  port: 16361,
  username: 'afkadboot',
  version: '1.21.11',
  auth: 'offline',
  viewDistance: 'tiny'
};

let bot;
let reconnectAttempts = 0;
const maxReconnectAttempts = 999; // خليها كبيرة باش يبقى دايماً
const reconnectDelay = 5000;

// ===== Create Bot =====
function createBot() {
  console.log('🚀 Starting Minecraft bot...');

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version,
    auth: config.auth,
    viewDistance: config.viewDistance
  });

  bot.once('login', () => {
    console.log(`✅ Logged in as ${bot.username}`);
    reconnectAttempts = 0;
  });

  bot.on('spawn', () => {
    console.log('✅ Spawned in world');
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message.toLowerCase().includes('hi')) {
      bot.chat(`Hi ${username} 👋`);
    }
  });

  bot.on('kicked', (reason) => {
    console.log('❌ Kicked:', reason.toString());
    reconnect();
  });

  bot.on('error', (err) => {
    console.log('❌ Error:', err.message);
    reconnect();
  });

  bot.on('end', () => {
    console.log('🔌 Disconnected');
    reconnect();
  });
}

// ===== Reconnect Logic =====
function reconnect() {
  if (reconnectAttempts >= maxReconnectAttempts) return;

  reconnectAttempts++;
  console.log(`⏳ Reconnecting in ${reconnectDelay / 1000}s (Attempt ${reconnectAttempts})`);

  setTimeout(() => {
    createBot();
  }, reconnectDelay);
}

// ===== Graceful shutdown =====
process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  if (bot) bot.quit();
  process.exit();
});

// ===== Start =====
createBot();