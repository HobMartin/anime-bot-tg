const { Composer } = require('telegraf');
const randomAnime = require('./randomAnime');
const loading = require('../../middlewares/loading');

const bot = new Composer();

bot.command('random_anime', loading, randomAnime);

module.exports = bot;
