const axios = require('axios');
const { parse } = require('node-html-parser');
const { getContentFromMeta } = require('../helper');

const BASE_URL = 'https://animego.online';

async function getRandom() {
  const { data } = await axios.get(`${BASE_URL}/random`);
  const root = parse(data);
  return {
    poster: BASE_URL + getContentFromMeta(root, 'og:image'),
    title: root.getElementsByTagName('img')[0].getAttribute('alt'),
    genres: root
      .querySelector('.page__details-list--genre')
      .getElementsByTagName('span')[1]
      .getElementsByTagName('a')
      .map((el) => el.textContent),
    link: getContentFromMeta(root, 'og:url'),
    description: getContentFromMeta(root, 'description'),
  };
}

module.exports = { getRandom };
