const { Composer } = require('telegraf');
const sendJoke = require('./commands/sendJoke');

const bot = new Composer();

bot.command('joke', sendJoke);

module.exports = bot;
