const { User } = require('../../../db/models');
const { buildName, messageCatchErrorFromCommand } = require('../../../utils/helper');
const { randomIntFromInterval, getPostfix } = require('../helpers/reputation');

module.exports = async (ctx) => {
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
};
