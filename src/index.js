require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const start = require('./common/start');
const alert = require('./common/alert');

const Anime = require('./features/anime');
const Admins = require('./features/admins');
const Chat = require('./features/chat');
const Alert = require('./features/alert');
const Joke = require('./features/jokes');

const miraiChatOnly = require('./middlewares/miraiChatOnly');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());

bot.start(start);
bot.command('alert', alert);

bot.use(miraiChatOnly);

bot.use(Anime);
bot.use(Admins);
bot.use(Chat);
bot.use(Alert);
bot.use(Joke);

// eslint-disable-next-line no-console
bot.catch((err) => console.log(err.message, err));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
