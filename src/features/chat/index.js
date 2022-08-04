const { Composer } = require('telegraf');
const addReputation = require('./commands/addReputation');
const leftChatMember = require('./commands/leftChatMember');
const newChatMember = require('./commands/newChatMember');
const userInfo = require('./commands/userInfo');
const loading = require('../../middlewares/loading');

const bot = new Composer();

bot.on('new_chat_members', newChatMember);
bot.on('left_chat_member', leftChatMember);
bot.hears(/\+/, addReputation);
bot.command('user_info', loading, userInfo);

module.exports = bot;
