const { Chat } = require('../db/models');

const { messageCatchErrorFromCommand } = require('../utils/helper');

module.exports = async (ctx) => {
  if (ctx.from.id !== +process.env.ADMIN_ID) {
    return ctx.deleteMessage(ctx.message.message_id);
  }
  const ruleURL = ctx.update.message.text.split(' ')[1];
  if (!ruleURL) {
    return ctx.deleteMessage(ctx.message.message_id);
  }
  try {
    const [chat] = await Chat.findOrCreate({
      where: { chatId: ctx.update.message.chat.id.toString() },
    });
    chat.ruleURL = ruleURL;
    await chat.save();
    ctx.deleteMessage(ctx.message.message_id);
  } catch (error) {
    ctx.telegram.sendMessage(process.env.ADMIN_ID, messageCatchErrorFromCommand(ctx, 29, error), {
      parse_mode: 'HTML',
    });
  }
};
