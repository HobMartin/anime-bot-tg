const { Composer } = require('telegraf');
const sendAlertMap = require('../common/sendAlertMap');

const bot = new Composer();
bot.hears(/\/alerts_map/, sendAlertMap);
module.exports = bot;
