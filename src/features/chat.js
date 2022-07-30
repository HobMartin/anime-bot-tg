const { Composer } = require('telegraf');
const addReputation = require('../common/addReputation');
const leftChatMember = require('../common/leftChatMember');
const newChatMember = require('../common/newChatMember');
const userInfo = require('../common/userInfo');

const bot = new Composer();

bot.on('new_chat_members', newChatMember);
bot.on('left_chat_member', leftChatMember);
bot.hears(/\+/, addReputation);
bot.hears(/\/user_info/, userInfo);

module.exports = bot;
