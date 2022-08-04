function buildName(from) {
  const name = `${from.first_name} ${from.last_name ?? ''}`;
  return !name.trim().length ? from.username : name;
}

function messageCatchErrorFromCommand(ctx, line, error) {
  return `Error by command <b>${ctx.update.message.text}</b> in chat: ${
    ctx.chat.title ?? ctx.chat.username
  }. Line: ${line} See LOGS: ${JSON.stringify(error)}`;
}

function getOptions(ctx) {
  const options = {};
  if (ctx.update?.message?.message_id) {
    options.reply_to_message_id = ctx.update.message.message_id;
  }
  return options;
}

module.exports = {
  buildName,
  messageCatchErrorFromCommand,
  getOptions,
};
