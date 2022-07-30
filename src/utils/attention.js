function alertMessage(alert) {
  if (alert) {
    return '🚨 <b>Повітряна тривога!</b>\nТерміново всі в укриття!';
  }
  return '✅ <b>Відбій повітряної тривоги!</b>\nПовертайтесь до нормального життя!';
}

const messages = [];

async function alertMiddleware(ctx, chatIDs, sendAlert) {
  chatIDs.forEach((chatId) => {
    ctx.telegram
      .sendMessage(chatId, alertMessage(sendAlert), {
        parse_mode: 'HTML',
      })
      .then((m) => {
        ctx.telegram.pinChatMessage(chatId, m.message_id);
        messages.push(m.message_id);
        if (!sendAlert) {
          setTimeout(() => {
            messages.forEach((message) => {
              ctx.telegram.unpinChatMessage(chatId, message);
            });
          }, 15000);
        }
      });
  });
}

module.exports = { alertMiddleware };
