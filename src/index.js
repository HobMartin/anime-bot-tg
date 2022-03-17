require('dotenv').config();
const { Telegraf, Markup, session } = require('telegraf');
const { getRandomAnime, getSongQuiz } = require('./anime');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());

bot.hears(/\/random_anime/, async (ctx) => {
  const { message, title } = await getRandomAnime();
  ctx.replyWithMarkdown(message, {
    disable_web_page_preview: false,
    ...Markup.inlineKeyboard([
      Markup.button.url(
        '🎬 Shikimori',
        `https://shikimori.one/animes?search=${encodeURIComponent(title)}`,
      ),
    ]),
  });
});

bot.hears(/\/song_quiz/, async (ctx) => {
  const {
    animeTitle, spotifyUrl, songUrl, answers,
  } = await getSongQuiz();
  ctx.session = { [ctx.message.from.id]: { animeTitle, spotifyUrl } };

  ctx.replyWithAudio(songUrl, {
    ...Markup.inlineKeyboard(
      answers.map(([title, isRight]) => Markup.button.callback(title, isRight)),
      { columns: 1 },
    ),
  });
});

bot.action('incorrect', async (ctx) => {
  await ctx.editMessageCaption(
    `❌ Неправильна відоповідь! ❌\n*Аніме:* ${ctx.session[ctx.from.id.toString()].animeTitle}`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        Markup.button.url('🎵 Spotify', ctx.session[ctx.from.id.toString()].spotifyUrl),
      ]),
    },
  );
  delete ctx.session[ctx.from.id.toString()];
});
bot.action('correct', async (ctx) => {
  await ctx.editMessageCaption(
    `✅ Правильна відоповідь! ✅\n*Аніме:* ${ctx.session[ctx.from.id.toString()].animeTitle}`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        Markup.button.url('🎵 Spotify', ctx.session[ctx.from.id.toString()].spotifyUrl),
      ]),
    },
  );
  delete ctx.session[ctx.from.id.toString()];
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
