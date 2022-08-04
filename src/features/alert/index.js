const { Composer } = require('telegraf');
const sendAlertMap = require('./commands/sendAlertMap');
const loading = require('../../middlewares/loading');

const bot = new Composer();

bot.command('alerts_map', loading, sendAlertMap);

module.exports = bot;
