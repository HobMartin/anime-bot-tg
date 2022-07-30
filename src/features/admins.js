const { Composer } = require('telegraf');
const chatRule = require('../common/chatRule');
const syncDb = require('../common/syncDb');
const onlyAdmin = require('../middlewares/only-admin');
const alert = require('../common/alert');

const bot = new Composer();

bot.command('alert', alert);
bot.command('sync_db_test', onlyAdmin, syncDb);
bot.command('set_chat_rule', onlyAdmin, chatRule);

module.exports = bot;
