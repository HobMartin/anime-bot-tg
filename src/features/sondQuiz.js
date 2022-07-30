const { Composer } = require('telegraf');
const { sendQuiz, incorrectAnswer, correctAnswer } = require('../common/sendSong');

const bot = new Composer();

bot.hears(/\/!song_quiz/, sendQuiz);

bot.action('incorrect', incorrectAnswer);
bot.action('correct', correctAnswer);

module.exports = bot;
