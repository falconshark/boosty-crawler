const fs = require('fs');
const axios = require('axios');
const Parser = require('./lib/Parser');
const Download = require('./lib/Download');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
let boostyCookies = config['boostyCookies'];
const postListFile = fs.readFileSync('./posts.json', 'utf-8');
const posts = JSON.parse(postListFile);

let targetFiles = []; 
try{
    const backupFile = fs.readFileSync('./filetUrlBak.json', 'utf-8');
    targetFiles = JSON.parse(backupFile);
}catch(ex){
    console.log('No backup file, start get file url from post');
}

async function downloadImage(){
    //If no backup file, get image url from website
    if(targetFiles.length === 0){
        for(let i = 0; i < posts.length; i++){
            const post = posts[i];
            const response = await axios.get(`https://boosty.to${post}`, {
                headers: {
                    Cookie: boostyCookies
                }
            });
            const body = response.data;
            const downloadUrls = Parser.getDownloadUrls(body);
            targetFiles = targetFiles.concat(downloadUrls);
        }
        //Backup post url
        fs.writeFileSync('filetUrlBak.json', JSON.stringify(targetFiles));
    }
    for(let i = 0; i < targetFiles.length; i++){
        const file = targetFiles[i];
        Download.downloadFile(file.name, file.url);
    }
}
downloadImage();