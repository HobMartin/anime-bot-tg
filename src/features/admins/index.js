const { Composer } = require('telegraf');
const chatRule = require('./commands/chatRule');
const syncDb = require('./commands/syncDb');
const mentionsAdmins = require('./commands/mentionsAdmins');
const pinAdminPool = require('./commands/pinAdminPool');
const onlyAdmin = require('../../middlewares/only-admin');

const bot = new Composer();

bot.command('sync_db_test', onlyAdmin, syncDb);
bot.command('set_chat_rule', onlyAdmin, chatRule);

bot.mention('@admin', mentionsAdmins);

bot.on('poll', onlyAdmin, pinAdminPool);

module.exports = bot;
