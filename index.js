const fs = require('fs');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const targetUrl = 'https://boosty.to/ja.stuff';
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
let boostyCookies = config['boostyCookies'];
boostyCookies = readCookie(boostyCookies, targetUrl);

async function startCrawler(){
    const browser = await puppeteer.launch({args: ['--window-size=1920,1080']});
    const page = await browser.newPage();
    await page.setCookie(...boostyCookies);
    await page.goto(targetUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await page.screenshot({ path: `./scrapingbee_homepage.jpg` });
    await browser.close();
}


function readCookie(cookie, targetUrl){
    const cookieObj = _cookieToObject(cookie);
    const cookies = _getCookieArray(cookieObj, targetUrl);
    return cookies;
}

function _cookieToObject(cookie) {
    const cookieObject = cookie.split('; ').reduce((prev, current) => {
        const [name, ...value] = current.split('=');
        prev[name] = value.join('=');
        return prev;
      }, {});
    return cookieObject;
}

function _getCookieArray(cookiesObj, targetUrl){
    const cookies = [];
    for(let i = 0; i < Object.keys(cookiesObj).length; i++){
        const key = Object.keys(cookiesObj)[i];
        const value = cookiesObj[key];
        const cookie = {
            'name': key,
            'value': value,
            'url': targetUrl
        };
        cookies.push(cookie);
    }
    return cookies;
}

startCrawler();