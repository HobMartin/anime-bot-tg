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

module.exports = { randomIntFromInterval, getReputationTitle, getPostfix };
