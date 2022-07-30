const { Composer } = require('telegraf');
const randomAnime = require('../common/randomAnime');

const bot = new Composer();

bot.hears(/\/random_anime/, randomAnime);

module.exports = bot;
