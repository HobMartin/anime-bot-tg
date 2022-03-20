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
  )}\n\n<b>Опис:</b> <span class="tg-spoiler"><i>${description}...</i></span>\n<a href="${photo}">⁠</a>`;
  return html;
}

function buildName(from) {
  const name = `${from.first_name} ${from.last_name}`;
  return !name.trim().length ? from.username : name;
}

function messageCatchErrorFromCommand(ctx, line, error) {
  return `Error in chat: ${
    ctx.chat.title ?? ctx.chat.username
  }. Line: ${line} See LOGS: <code>${JSON.stringify(error)}</code>`;
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getReputationTitle(rep) {
  if (rep >= 0 && rep <= 50) return 'Учень академії';
  if (rep >= 51 && rep <= 100) return 'Генін';
  if (rep >= 101 && rep <= 150) return 'Чунін';
  if (rep >= 151 && rep <= 200) return 'Токубетсу Джонін';
  if (rep >= 201 && rep <= 250) return 'Джонін';
  if (rep >= 251) return 'Каге';
  return false;
}

function getPostfix(rep) {
  if (rep === 1) return `${rep} бал`;
  if (rep >= 2 && rep <= 4) return `${rep} бали`;
  return `${rep} балів`;
}

module.exports = {
  getAnimeTitle,
  shuffle,
  getContentFromMeta,
  getAnimeAboutMessage,
  buildName,
  messageCatchErrorFromCommand,
  randomIntFromInterval,
  getReputationTitle,
  getPostfix,
};
