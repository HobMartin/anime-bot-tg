function getAnimeTitle(data) {
  return data.titles.en ?? data.titles.rj;
}
function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // eslint-disable-next-line no-param-reassign
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function getContentFromMeta(root, prop) {
  return root
    .getElementsByTagName('meta')
    .find((el) => el.getAttribute('property') === prop || el.getAttribute('name') === prop)
    .getAttribute('content');
}

function getAnimeAboutMessage(title, genres, description, photo) {
  const html = `<b>Назва:</b> ${title}\n\n<b>Жанри:</b> ${genres.join(
    ', ',
  )}\n\n<b>Опис:</b> <span class="tg-spoiler"><code>${description}...</code></span>\n<a href="${photo}">⁠</a>`;
  return html;
}

module.exports = {
  getAnimeTitle,
  shuffle,
  getContentFromMeta,
  getAnimeAboutMessage,
};
