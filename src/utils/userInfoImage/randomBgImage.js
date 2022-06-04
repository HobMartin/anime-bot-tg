const imageSet = [
  'https://img.freepik.com/free-vector/asian-night-bedroom-chinese-japanese-room_33099-1854.jpg?t=st=1654366766~exp=1654367366~hmac=c56653b75a78e9a48aaefc397f75252f70459fdc9244bc38fc40207d6ed9a925&w=826',
  'https://img.freepik.com/free-vector/modern-japanese-street-with-buildings_52683-46019.jpg?t=st=1654366766~exp=1654367366~hmac=e11729ed4fd45dcc7c6736a5f8ce0255db911745498cc1bcd37bf6114d44064c&w=740',
  'https://img.freepik.com/free-vector/gradient-japanese-temple-with-sun_52683-44985.jpg?t=st=1654366839~exp=1654367439~hmac=daa7e6cea2d26d15abae6511a1d255d883575a9c549ff4cc4e377f1550444bf4&w=826',
  'https://img.freepik.com/free-vector/japanese-temple-surrounded-by-nature_52683-46009.jpg?t=st=1654346448~exp=1654347048~hmac=72eb4bc4151602a54af64b4508b07ed2d6a780bb4e941d621877f68255ba0492&w=826',
  'https://img.freepik.com/free-vector/gradient-japanese-temple-illustration_52683-46008.jpg?t=st=1654366868~exp=1654367468~hmac=b4820cd20a84a535e3374c7cfb0f0e56474601dcb4a8047f24273c06eec3c4a9&w=826',
];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * imageSet.length);
  return imageSet[randomIndex];
};

module.exports = { getRandomImage };
