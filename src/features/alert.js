const { Composer } = require('telegraf');
const sendAlertMap = require('../common/sendAlertMap');
const loading = require('../middlewares/loading');

const bot = new Composer();

bot.hears(/\/alerts_map/, loading, sendAlertMap);

module.exports = bot;
