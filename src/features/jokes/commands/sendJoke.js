const _ = require('lodash');
const jokes = require('../../../constants/jokes');
const { ANIME_JOKES_GIF } = require('../../../constants');
const { getOptions } = require('../../../utils/helper');

module.exports = async (ctx) => {
  const message = `${_.sample(jokes)}\n<a href="${_.sample(ANIME_JOKES_GIF)}">⁠</a>`;
  ctx.replyWithHTML(message, getOptions(ctx));
};
