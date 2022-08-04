const { getOptions, buildName } = require('../../../utils/helper');

module.exports = (ctx) => {
  if (ctx.update.message.from.isBot) return;
  const userMention = `<a href="tg://user?id=${ctx.update.message.from.id}">${buildName(
    ctx.update.message.from,
  )}</a>`;
  ctx.replyWithHTML(`😔 Прощавай, ${userMention} !\n\nМи будемо сумувати 😭`, getOptions(ctx));
};
