const express = require('express')
const app = express()
require('dotenv').config();
const mongoose = require('mongoose');
const bot = require('./src/bot');

// MongoDB ga ulanish
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Botni ishga tushirish
bot.start({
  onStart: (botInfo) => {
    console.log('✅ Bot started successfully!');
    console.log(`Bot username: @${botInfo.username}`);
    console.log(`Bot ID: ${botInfo.id}`);
  }
});

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\n⏸️  Bot stopping...');
  bot.stop();
});

process.once('SIGTERM', () => {
  console.log('\n⏸️  Bot stopping...');
  bot.stop();
});

app.listen(process.env.PORT, () => {
    console.log('Server running')
})