const fs = require('fs');
const axios = require('axios');
const Parser = require('./lib/Parser');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
let boostyCookies = config['boostyCookies'];
const postListFile = fs.readFileSync('./posts.json', 'utf-8');
const posts = JSON.parse(postListFile);

async function downloadImage(){
    for(let i = 0; i < posts.length; i++){
        const post = posts[i];
        if(i === 0){
            const response = await axios.get(`https://boosty.to${post}`, {
                headers: {
                    Cookie: boostyCookies
                }
            });
            const body = response.data;
            const downloadUrls = Parser.getDownloadUrls(body);
            console.log(downloadUrls);
        }
    }
}


downloadImage();