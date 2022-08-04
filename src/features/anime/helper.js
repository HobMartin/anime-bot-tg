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

module.exports = { getContentFromMeta, getAnimeAboutMessage };
