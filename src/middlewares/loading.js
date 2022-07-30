const _ = require('lodash');
const { ANIME_GIFS } = require('../constants');

module.exports = async (ctx, next) => {
  const message = `⏳ <b>Зачекайте будь ласка...</b>\n<a href="${_.sample(ANIME_GIFS)}">⁠</a>`;
  const loadingGif = await ctx.replyWithHTML(message);
  await next();
  ctx.deleteMessage(loadingGif.message_id);
};
