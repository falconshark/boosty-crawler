const fs = require('fs');
const puppeteer = require('puppeteer');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
const targetUrl = config['boostyUrl'];
let boostyCookies = config['boostyCookies'];
boostyCookies = readCookie(boostyCookies, targetUrl);

const Parser = require('./lib/Parser');

async function startCrawler(){
    console.log('Start getting post list.');
    const browser = await puppeteer.launch({ headless: false, args: ['--window-size=1920,1080']});
    const page = await browser.newPage();
    await page.setDefaultTimeout(0);
    await page.setCookie(...boostyCookies);
    await page.goto(targetUrl, {waitUntil: 'load', timeout: 0});
    await page.setViewport({ width: 1920, height: 1080 });
    await autoScroll(page);

    let pageContent = await page.evaluate(() => {
        return document.querySelector('*').outerHTML;
    });

    //If page had load more button, keep loading
    if(Parser.checkHadLoadMore(pageContent)){
        await page.click('.Feed_center_dBcF0 .BaseButton_button_yO8r5');
        await autoScroll(page);
        pageContent = await page.evaluate(() => {
            return document.querySelector('*').outerHTML;
        });
    }
    console.log('Getting post urls...');
    const postUrls = Parser.getPostUrls(pageContent);
    fs.writeFileSync('posts.json', JSON.stringify(postUrls));
    console.log('Completed.');
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

function _getCookieArray(cookiesObj){
    const cookies = [];
    for(let i = 0; i < Object.keys(cookiesObj).length; i++){
        const key = Object.keys(cookiesObj)[i];
        const value = cookiesObj[key];
        const cookie = {
            'name': key,
            'value': value,
            'domain': 'boosty.to'
        };
        cookies.push(cookie);
    }
    return cookies;
}

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(async () => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 300);
        });
    });
}

startCrawler();
