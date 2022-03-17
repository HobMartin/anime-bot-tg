require('dotenv').config();
const { Telegraf, Markup, session } = require('telegraf');
const sequelize = require('./db/init');
const { User, Questions } = require('./db/models');
const { getSongQuiz } = require('./anime');
const { getRandom } = require('./animeParse');
const { getAnimeAboutMessage } = require('./helper');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());

bot.command('sync_db', async (ctx) => {
  if (ctx.from.id !== +process.env.ADMIN_ID) return;
  const force = ctx.update.message.text.split(' ')[1] === 'force';
  try {
    await sequelize.sync({ force }).then(() => ctx.deleteMessage(ctx.message.message_id));
  } catch (error) {
    ctx.telegram.sendMessage(
      process.env.ADMIN_ID,
      `Error in chat: ${ctx.chat.title ?? ctx.chat.username}. See LOGS: \`\`\`${JSON.stringify(
        error,
      )}\`\`\``,
      { parse_mode: 'Markdown' },
    );
  }
});

bot.start(async (ctx) => {
  ctx.reply('Привіт! Я аніме бот!');
});

bot.hears(/\/random_anime/, async (ctx) => {
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
  });
});

bot.hears(/\/user_info/, async (ctx) => {
  try {
    const user = await User.findOne({
      where: { userId: ctx.update.message.from.id },
    });
    ctx.replyWithHTML(
      `<b>Гравець:</b> ${ctx.from.username}\n<b>Правильно вгаданих пісень:</b>${
        user?.right ?? 0
      }\n<b>Кількість невгаданих пісень: </b>${user?.wrong ?? 0}`,
    );
  } catch (error) {
    ctx.replyWithHTML(`<b>Гравець:</b> ${ctx.from.username}\n<b>Ти ще не грав!</b>`);
  }
});

bot.hears(/\/song_quiz/, async (ctx) => {
  try {
    User.findOrCreate({ where: { userId: ctx.update.message.from.id } });
    const { animeTitle, spotifyUrl, songUrl, answers } = await getSongQuiz();
    // eslint-disable-next-line no-console
    console.log({ songUrl });
    ctx
      .replyWithAudio(songUrl, {
        ...Markup.inlineKeyboard(
          answers.map(([title, isRight]) => Markup.button.callback(title, isRight)),
          { columns: 1 },
        ),
      })
      .then((data) => {
        Questions.create({ messageId: data.message_id, animeTitle, spotifyUrl });
      })
      .catch((error) => {
        ctx.telegram.sendMessage(
          process.env.ADMIN_ID,
          `Error in chat: ${ctx.chat.title ?? ctx.chat.username}. See LOGS: \`\`\`${JSON.stringify(
            error,
          )}\`\`\``,
          { parse_mode: 'Markdown' },
        );
      });
  } catch (error) {
    ctx.telegram.sendMessage(
      process.env.ADMIN_ID,
      `Error in chat: ${ctx.chat.title ?? ctx.chat.username}. See LOGS: \`\`\`${JSON.stringify(
        error,
      )}\`\`\``,
      { parse_mode: 'Markdown' },
    );
    ctx.reply('Сталася якась помилка!');
  }
});

bot.action('incorrect', async (ctx) => {
  try {
    const user = await User.findOne({ where: { userId: ctx.update.callback_query.from.id } });
    const question = await Questions.findOne({
      where: {
        messageId: ctx.update.callback_query.message.message_id,
      },
    });
    await ctx.editMessageCaption(`❌ Неправильно! ❌\n*Аніме:* ${question.animeTitle}`, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([Markup.button.url('🎵 Spotify', question.spotifyUrl)]),
    });
    user.wrong += 1;
    await question.destroy();
    await user.save();
  } catch (error) {
    ctx.telegram.sendMessage(
      process.env.ADMIN_ID,
      `Error in chat: ${ctx.chat.title ?? ctx.chat.username}. See LOGS: \`\`\`${JSON.stringify(
        error,
      )}\`\`\``,
      { parse_mode: 'Markdown' },
    );
  }
});
bot.action('correct', async (ctx) => {
  try {
    const user = await User.findOne({ where: { userId: ctx.update.callback_query.from.id } });
    const question = await Questions.findOne({
      where: {
        messageId: ctx.update.callback_query.message.message_id,
      },
    });
    await ctx.editMessageCaption(`✅ Правильно! ✅\n*Аніме:* ${question.animeTitle}`, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([Markup.button.url('🎵 Spotify', question.spotifyUrl)]),
    });
    user.right += 1;
    await question.destroy();
    await user.save();
  } catch (error) {
    ctx.telegram.sendMessage(
      process.env.ADMIN_ID,
      `Error in chat: ${ctx.chat.title ?? ctx.chat.username}. See LOGS: \`\`\`${JSON.stringify(
        error,
      )}\`\`\``,
      { parse_mode: 'Markdown' },
    );
  }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
