const { Markup } = require('telegraf');

const { getRandom } = require('../utils/anime/animeParse');
const { getAnimeAboutMessage, getOptions } = require('../utils/helper');

module.exports = async (ctx) => {
  const data = await getRandom();
  ctx.reply(getAnimeAboutMessage(data.title, data.genres, data.description, data.poster), {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard(
      [
        Markup.button.url('Дивитись аніме...', data.link),
        Markup.button.url(
          '🎬 Shikimori',
          `https://shikimori.one/animes?search=${encodeURIComponent(data.title)}`,
        ),
      ],
      { columns: 1 },
    ),
    ...getOptions(ctx),
  });
};
