const { alertMiddleware } = require('../utils/attention');
const { messageCatchErrorFromCommand } = require('../utils/helper');
const { Chat } = require('../db/models');

module.exports = async (ctx) => {
  if (ctx.from.id !== +process.env.ADMIN_ID) {
    return ctx.deleteMessage(ctx.message.message_id);
  }
  try {
    const chats = await (await Chat.findAll({ attributes: ['chatId'] })).map((chat) => chat.chatId);
    await ctx.deleteMessage(ctx.message.message_id);
    await alertMiddleware(ctx, chats, !!+ctx.message.text.split(' ')[1]);
  } catch (error) {
    ctx.telegram.sendMessage(process.env.ADMIN_ID, messageCatchErrorFromCommand(ctx, 29, error), {
      parse_mode: 'HTML',
    });
  }
};
