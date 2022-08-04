const sequelize = require('../../../db/init');
const { messageCatchErrorFromCommand } = require('../../../utils/helper');

module.exports = async (ctx) => {
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
};
