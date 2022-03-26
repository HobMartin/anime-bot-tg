const axios = require('axios');

let attention = false;

const target = new Set(['Чернівецька область', 'м. Чернівці']);

function allertMessage(allert) {
  if (allert) {
    return '🚨 <b>Повітряна тривога!</b>\nТерміново всі в укриття!\n\n<i>Повідомлення створено за допомогою Ukrzen Team</i>';
  }
  return '✅ <b>Відбій повітряної тривоги!</b>\nПовертайтесь до нормального життя!\n\n<i>Повідомлення створено за допомогою Ukrzen Team</i>';
}

async function getAlert() {
  const resp = await axios.get('https://war.ukrzen.in.ua/alerts/api/alerts/active.json');
  return {
    status: resp.status,
    data: resp.data.alerts.some((alert) => target.has(alert.location_title)),
  };
}

const messages = [];

async function allertMiddlware(ctx, chatIDs) {
  const { status, data: sendAllert } = await getAlert();
  if (status === 502) {
    await allertMiddlware();
  } else if (status !== 200) {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await allertMiddlware();
  } else {
    // eslint-disable-next-line no-console
    console.log({ sendAllert, attention });
    if (sendAllert !== attention) {
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
    setTimeout(async () => {
      await allertMiddlware();
    }, 20000);
    attention = sendAllert;
  }
}

module.exports = { allertMiddlware };
