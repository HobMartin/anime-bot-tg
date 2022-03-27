function allertMessage(allert) {
  if (allert) {
    return '🚨 <b>Повітряна тривога!</b>\nТерміново всі в укриття!';
  }
  return '✅ <b>Відбій повітряної тривоги!</b>\nПовертайтесь до нормального життя!';
}

const messages = [];

async function allertMiddlware(ctx, chatIDs, sendAllert) {
  chatIDs.forEach((chatId) => {
    ctx.telegram
      .sendMessage(chatId, allertMessage(sendAllert), {
        parse_mode: 'HTML',
      })
      .then((m) => {
        ctx.telegram.pinChatMessage(chatId, m.message_id);
        messages.push(m.message_id);
        if (!sendAllert) {
          setTimeout(() => {
            messages.forEach((message) => {
              ctx.telegram.unpinChatMessage(chatId, message);
            });
          }, 15000);
        }
      });
  });
}

module.exports = { allertMiddlware };
