require('dotenv').config();
const { API } = require('@mattplays/aniapi');
const { getAnimeTitle, shuffle } = require('./helper');

const AnimeApi = new API(process.env.ANI_API_KEY);

async function getRandomAnime() {
  const { data } = await AnimeApi.Anime.Random(1, false);
  const message = `*Назва:* ${getAnimeTitle(data[0])}\n*Рік випуску:* ${new Date(
    data[0].start_date,
  ).getFullYear()}\n*Жанри:* ${data[0].genres.join(', ')}\n[⁠](${data[0].cover_image})`;
  return { message, title: getAnimeTitle(data[0]) };
}

async function getAnimeById(id) {
  const { data } = await AnimeApi.Anime.GetByID(id);
  return getAnimeTitle(data);
}

async function getRandomSong() {
  const { data } = await AnimeApi.Song.Random(1);
  return data;
}

async function getSongQuiz() {
  const [song] = await getRandomSong();
  const { data } = await AnimeApi.Anime.Random(2, true);
  const animeTitle = await getAnimeById(song.anime_id);
  const answers = [
    [getAnimeTitle(data[0]), 'incorrect'],
    [getAnimeTitle(data[1]), 'incorrect'],
    [animeTitle, 'correct'],
  ];

  return {
    animeTitle,
    spotifyUrl: song.open_spotify_url,
    songUrl: song.preview_url,
    answers: shuffle(answers),
  };
}

module.exports = { getRandomAnime, getRandomSong, getSongQuiz };
