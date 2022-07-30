const { Chat } = require('../db/models');
const { buildName, messageCatchErrorFromCommand, getOptions } = require('../utils/helper');

module.exports = async (ctx) => {
  if (ctx.update.message.from.isBot) return;
  const userMention = `<a href="tg://user?id=${ctx.update.message.from.id}">${buildName(
    ctx.update.message.from,
  )}</a>`;
  const helloMessage = `🎉 Привіт, ${userMention} !\nРаді тебе вітати 👋 в нашому ламповому чаті!`;

  try {
    const chat = await Chat.findOne({
      where: { chatId: ctx.update.message.chat.id.toString() },
    });
    const member = await ctx.telegram.getChatMember(ctx.message.chat.id, ctx.message.from.id);
    if (!chat?.ruleURL) {
      // ctx.replyWithHTML(
      //   helloMessage,
      //   getOptions(ctx)
      // );
      if (member && (member.status === 'creator' || member.status === 'administrator')) {
        ctx.reply('Цей бот створено для аніме чату Мірай https://t.me/+o8EiUWiA_kwwMTc6');
      }
      return;
    }
    ctx.replyWithHTML(
      `${helloMessage}\n\nПропоную тобі ознайомитись з ✍️ <a href="${chat.ruleURL}">правилами</a>`,
      getOptions(ctx),
    );
  } catch (error) {
    ctx.telegram.sendMessage(process.env.ADMIN_ID, messageCatchErrorFromCommand(ctx, 190, error), {
      parse_mode: 'HTML',
    });
  }
};
