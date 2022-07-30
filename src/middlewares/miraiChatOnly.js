module.exports = async ({ message }, next) => {
  if (message.chat.id === +process.env.CHAT_ID) {
    return next();
  }
};
