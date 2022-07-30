const { messageCatchErrorFromCommand, getOptions } = require('../utils/helper');

const { getAlertsMap } = require('../utils/alertsCard');

module.exports = async (ctx) => {
  try {
    const mapImage = await getAlertsMap();
    ctx.replyWithPhoto({ source: mapImage }, getOptions(ctx));
  } catch (error) {
    ctx.telegram.sendMessage(process.env.ADMIN_ID, messageCatchErrorFromCommand(ctx, 29, error), {
      parse_mode: 'HTML',
    });
  }
};
