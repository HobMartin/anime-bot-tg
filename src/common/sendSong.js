const { Markup } = require('telegraf');
const { messageCatchErrorFromCommand } = require('../utils/helper');
const { getSongQuiz } = require('../utils/anime/anime');
const { User, Questions } = require('../db/models');

const sendQuiz = async (ctx) => {
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
        Questions.create({
          messageId: data.message_id,
          animeTitle,
          spotifyUrl,
        });
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
};

const incorrectAnswer = async (ctx) => {
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
};

const correctAnswer = async (ctx) => {
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
};

module.exports = { sendQuiz, incorrectAnswer, correctAnswer };
