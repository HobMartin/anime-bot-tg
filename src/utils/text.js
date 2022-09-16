const { EMPTY } = require('../constants/text');

const buildName = (from) => {
  const name = `${from.first_name} ${from.last_name ?? ''}`;
  return !name.trim().length ? from.username : name;
};

const imageAsLink = (image) => `<a href=${image}>${EMPTY}</a>`;

const userMention = (message) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  `<a href="tg://user?id=${message.from.id}">${buildName(message.from)}</a>`;

const textTransform = {
  bold: (text) => `<b>${text}</b>`,
};

module.exports = {
  imageAsLink,
  userMention,
  buildName,
  textTransform,
};
