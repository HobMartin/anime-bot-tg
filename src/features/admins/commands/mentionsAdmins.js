const { buildName } = require('../../../utils/helper');

const mentionsAdmins = async (ctx) => {
  const chatAdmins = await ctx.getChatAdministrators();
  const admins = chatAdmins.filter((admin) => !admin.user.is_bot);
  ctx.reply(
    `Надіслано адміністраторам групи: ${admins.map((admin) => buildName(admin.user)).join(', ')}`,
  );
  admins.forEach((admin) => {
    ctx.telegram.sendMessage(
      admin.user.id,
      'Шановний пан адміністратор в групі сталося лихо, термінво потрібна ваша допомога!',
    );
  });
};

module.exports = mentionsAdmins;
