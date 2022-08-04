const { User } = require('../../../db/models');
const { buildName, getOptions } = require('../../../utils/helper');
const { generateImage, generateHTML } = require('../helpers/userInfoImage');
const { getReputationTitle } = require('../helpers/reputation');

module.exports = async (ctx) => {
  try {
    const user = await User.findOne({
      where: { userId: ctx.update.message.from.id },
    });
    const data = {
      name: buildName(ctx.from),
      rang: `${getReputationTitle(user?.reputation ?? 0)} (${user?.reputation ?? 0})`,
    };
    const html = generateHTML(data);
    const image = await generateImage(html);
    ctx.replyWithPhoto({ source: image }, getOptions(ctx));
  } catch (error) {
    const data = {
      name: buildName(ctx.from),
    };
    const html = generateHTML(data);
    const image = await generateImage(html);
    ctx.replyWithPhoto({ source: image }, getOptions(ctx));
  }
};
