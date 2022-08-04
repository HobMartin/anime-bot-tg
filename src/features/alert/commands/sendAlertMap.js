const { messageCatchErrorFromCommand, getOptions } = require('../../../utils/helper');

const { getAlertsMap } = require('../alertMap');

module.exports = async (ctx) => {
  try {
    const actionEnd = await ctx.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
    const mapImage = await getAlertsMap();
    if (actionEnd && mapImage) {
      ctx.replyWithPhoto({ source: mapImage }, getOptions(ctx));
    }
  } catch (error) {
    ctx.telegram.sendMessage(process.env.ADMIN_ID, messageCatchErrorFromCommand(ctx, 29, error), {
      parse_mode: 'HTML',
    });
  }
};
