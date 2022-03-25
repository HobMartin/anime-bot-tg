require('dotenv').config();
const { Telegraf, Markup, session } = require('telegraf');
const sequelize = require('./db/init');
const { User, Questions, Chat } = require('./db/models');
const { getSongQuiz } = require('./anime');
const { getRandom } = require('./animeParse');
const {
  getAnimeAboutMessage,
  buildName,
  messageCatchErrorFromCommand,
  randomIntFromInterval,
  getReputationTitle,
  getPostfix,
} = require('./helper');
const { allertMiddlware } = require('./attention');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());

async function sendAllert() {
  try {
    const chats = await Chat.findAll();
    const chatIDs = chats.map((chat) => +chat.getDataValue('chatId'));
    setInterval(() => {
      allertMiddlware(bot, chatIDs);
    }, 20000);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
sendAllert();

// eslint-disable-next-line consistent-return
bot.command('sync_db_test', async (ctx) => {
  if (ctx.from.id !== +process.env.ADMIN_ID) {
    return ctx.deleteMessage(ctx.message.message_id);
  }
  const force = ctx.update.message.text.split(' ')[1] === 'force';
  try {
    await sequelize.sync({ force }).then(() => ctx.deleteMessage(ctx.message.message_id));
  } catch (error) {
    ctx.telegram.sendMessage(process.env.ADMIN_ID, messageCatchErrorFromCommand(ctx, 29, error), {
      parse_mode: 'HTML',
    });
  }
});

// eslint-disable-next-line consistent-return
bot.command('set_chat_rule', async (ctx) => {
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
    reply_to_message_id: ctx.update.message.message_id,
  });
});

bot.hears(/\/user_info/, async (ctx) => {
  try {
    const user = await User.findOne({
      where: { userId: ctx.update.message.from.id },
    });
    ctx.replyWithHTML(
      `<b>Користувач:</b> ${buildName(ctx.from)}\n\n🏆 <b>Ранг:</b> ${getReputationTitle(
        user?.reputation ?? 0,
      )} (${user?.reputation ?? 0})\n<b>Правильно вгаданих пісень: </b>${
        user?.right ?? 0
      }\n<b>Кількість невгаданих пісень: </b>${user?.wrong ?? 0}`,
      { reply_to_message_id: ctx.update.message.message_id },
    );
  } catch (error) {
    ctx.replyWithHTML(`<b>Гравець:</b> ${buildName(ctx.from)}\n<b>Ти ще не грав!</b>`);
  }
});

bot.hears(/\/song_quiz/, async (ctx) => {
  try {
    // eslint-disable-next-line object-curly-newline
    const { animeTitle, spotifyUrl, songUrl, answers } = await getSongQuiz();
    if (!songUrl) {
      throw new Error('Немає preview_url');
    }
    User.findOrCreate({ where: { userId: ctx.update.message.from.id } });
    ctx
      .replyWithAudio(songUrl, {
        ...Markup.inlineKeyboard(
          answers.map(([title, isRight]) => Markup.button.callback(title, isRight)),
          { columns: 1 },
        ),
        reply_to_message_id: ctx.update.message.message_id,
      })
      .then((data) => {
        Questions.create({ messageId: data.message_id, animeTitle, spotifyUrl });
      })
      .catch((error) => {
        ctx.telegram.sendMessage(
          process.env.ADMIN_ID,
          messageCatchErrorFromCommand(ctx, 116, error),
          {
            parse_mode: 'HTML',
          },
        );
      });
  } catch (error) {
    ctx.telegram.sendMessage(process.env.ADMIN_ID, messageCatchErrorFromCommand(ctx, 123, error), {
      parse_mode: 'HTML',
    });
    ctx.reply('Сталася якась помилка!');
  }
});

bot.action('incorrect', async (ctx) => {
  try {
    const [user] = await User.findOrCreate({
      where: { userId: ctx.update.callback_query.from.id },
    });
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
    ctx.telegram.sendMessage(process.env.ADMIN_ID, messageCatchErrorFromCommand(ctx, 148, error), {
      parse_mode: 'HTML',
    });
  }
});
bot.action('correct', async (ctx) => {
  try {
    const [user] = await User.findOrCreate({
      where: { userId: ctx.update.callback_query.from.id },
    });
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
    ctx.telegram.sendMessage(process.env.ADMIN_ID, messageCatchErrorFromCommand(ctx, 149, error), {
      parse_mode: 'HTML',
    });
  }
});

bot.on('new_chat_members', async (ctx) => {
  if (ctx.update.message.from.isBot) return;
  const helloMessage = `🎉 Привіт, @${ctx.update.message.from.username} !\nРаді тебе вітати 👋 в нашому ламповому чаті!`;
  try {
    const chat = await Chat.findOne({ where: { chatId: ctx.update.message.chat.id.toString() } });
    if (!chat?.ruleURL) {
      ctx.replyWithHTML(helloMessage, { reply_to_message_id: ctx.update.message.message_id });
      return;
    }
    ctx.replyWithHTML(
      `${helloMessage}\n\nПропоную тобі ознайомитись з ✍️ <a href="${chat.ruleURL}">правилами</a>`,
      { reply_to_message_id: ctx.update.message.message_id },
    );
  } catch (error) {
    ctx.telegram.sendMessage(process.env.ADMIN_ID, messageCatchErrorFromCommand(ctx, 190, error), {
      parse_mode: 'HTML',
    });
  }
});
bot.on('left_chat_member', (ctx) => {
  if (ctx.update.message.from.isBot) return;
  ctx.reply(`😔 Прощавай, @${ctx.update.message.from.username} !\n\nМи будемо сумувати 😭`, {
    reply_to_message_id: ctx.update.message.message_id,
  });
});

bot.hears(/\+/, async (ctx) => {
  const { from, reply_to_message: reply } = ctx.update.message;
  if (!reply) return;
  if (reply.from.is_bot) return;
  if (reply.text === '+') {
    ctx.reply('Щоб підняти репутацію, ви повинні відповісти на початкове повідомлення!');
    return;
  }
  if (reply.from.id === from.id) {
    ctx.reply('Ви не можете збільшити репутацію самому собі!');
    return;
  }
  try {
    const [fromUser] = await User.findOrCreate({
      where: { userId: from.id },
    });
    const [toUser] = await User.findOrCreate({
      where: { userId: reply.from.id },
    });
    const reputationCount = randomIntFromInterval(1, 10);
    ctx.reply(
      `${buildName(from)}(${fromUser.reputation}) збільшив(-ла) репутацію ${buildName(
        reply.from,
      )}(${toUser.reputation}) на ${getPostfix(reputationCount)}.`,
    );
    toUser.reputation += reputationCount;
    await toUser.save();
  } catch (error) {
    ctx.telegram.sendMessage(process.env.ADMIN_ID, messageCatchErrorFromCommand(ctx, 225, error), {
      parse_mode: 'HTML',
    });
  }
});
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
