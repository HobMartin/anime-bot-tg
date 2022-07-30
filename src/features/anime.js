const { Composer } = require('telegraf');
const randomAnime = require('../common/randomAnime');
const loading = require('../middlewares/loading');

const bot = new Composer();

bot.hears(/\/random_anime/, loading, randomAnime);

module.exports = bot;
