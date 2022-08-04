const { IMAGE_SET } = require('../../../../constants');

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * IMAGE_SET.length);
  return IMAGE_SET[randomIndex];
};

module.exports = { getRandomImage };
