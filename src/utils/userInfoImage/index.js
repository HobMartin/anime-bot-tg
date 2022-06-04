const puppeteer = require('puppeteer');
const { getRandomImage } = require('./randomBgImage');

const testHTML = `
<html>
  <head>
    <style>
      * {
        margin: 0;
        padding: 0;
      }

      *,
      *:before,
      *:after {
        box-sizing: border-box;
      }

      html,
      body {
        background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${getRandomImage()});
        background-size: cover;
        background-position: center center;
        width: 1200px;
        height: 628px;
        font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
      }

      div {
        width: 1200px;
        height: 628px;
        padding: 0 200px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      h1 {
        font-size: 48px;
        line-height: 56px;
        color: #fff;
        margin: 0;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div>
      <h1>How to Convert HTML to an Image Using Puppeteer in Node.js</h1>
    </div>
  </body>
</html>
`;

function generateHTML(data) {
  return `
<html>
  <head>
    <style>
      * {
        margin: 0;
        padding: 0;
      }

      *,
      *:before,
      *:after {
        box-sizing: border-box;
      }

      html,
      body {
        background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${getRandomImage()});
        background-size: cover;
        background-position: center center;
        width: 1200px;
        height: 628px;
        font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
      }

      div {
        width: 1200px;
        height: 628px;
        padding: 0 200px;
        display: flex;
        flex-direction: column;
        gap:20px;
        align-items: center;
        justify-content: center;
      }
      
      h1.title {
        font-size: 6vw;
    }

    .text {
        font-size: 5vw;
        color: #fff;
        margin: 0;
        text-align: center;
    }
    </style>
  </head>
  <body>
    <div>
    <h1 class="text title">${data.name}</h1>
    ${data.rang && `<h2 class="text">🏆 Ранг: <i>${data.rang}</i></h2>`}
    </div>
  </body>
</html>
`;
}

async function generateImage(html) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    timeout: 10000,
  });
  const page = await browser.newPage();
  await page.setContent(html);
  await page.setViewport({ width: 1200, height: 628 });
  const screenshot = await page.screenshot({
    encoding: 'binary',
  });
  await browser.close();
  return screenshot;
}

module.exports = { generateImage, testHTML, generateHTML };
