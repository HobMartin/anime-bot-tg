const pinAdminPool = async (ctx) => {
  ctx.telegram.pinChatMessage(ctx.message.chat.id, ctx.message.message_id);
};

module.exports = pinAdminPool;
