const puppeteer = require('puppeteer');

async function getAlertsMap() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 10000,
  });
  const page = await browser.newPage();
  await page.goto('https://alerts.in.ua/');
  await page.setViewport({ width: 1200, height: 628 });
  await page.waitForTimeout(2000);
  const screenshot = await page.screenshot({
    encoding: 'binary',
  });
  await browser.close();
  return screenshot;
}

module.exports = { getAlertsMap };
