const { Composer } = require('telegraf');
const sendJoke = require('../common/sendJoke');

const bot = new Composer();

bot.hears(/\/joke/, sendJoke);

module.exports = bot;
