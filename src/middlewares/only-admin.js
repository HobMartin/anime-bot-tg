module.exports = async ({ message, telegram }, next) => {
  const member = await telegram.getChatMember(message.chat.id, message.from.id);
  if (member && (member.status === 'creator' || member.status === 'administrator')) {
    return next();
  }
  return 0;
};
