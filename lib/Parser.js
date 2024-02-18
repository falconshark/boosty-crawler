const cheerio = require('cheerio');

function checkHadLoadMore(html){
    let $ = cheerio.load(html);
    if($('.Feed_center_oGu8f .BaseButton_button_yO8r5').length !== 0){
        return true;
    }
    return false;
}

function getDownloadUrls(html){
    const downloadUrls = [];
    let $ = cheerio.load(html);
    //If had downable file, get the file url
    if($('.FileBlock_link_NSv4s').length !== 0){
        $('.FileBlock_link_NSv4s').each(function(){
            const randomfileName = (Math.random() + 1).toString(36).substring(7);
            const fullFileName = `${randomfileName}.png`;
            const href = $(this).attr('href');
            const file = {
                name: fullFileName,
                url: href,
            };
            downloadUrls.push(file);
        });
    }else{
        $('.BlockRenderer_image_NEsbT').each(function(){
            const randomfileName = (Math.random() + 1).toString(36).substring(7);
            const fullFileName = `${randomfileName}.png`;
            const url = $(this).attr('src');
            const file = {
                name: fullFileName,
                url: url,
            };
            downloadUrls.push(file);
        });
    }
    return downloadUrls;
}

function getPostUrls(html){
    const postUrls = [];
    let $ = cheerio.load(html);
    $('.Link_defaultStyled_t7118').each(function(){
        const href = $(this).attr('href');
        postUrls.push(href);
    });
    return postUrls;
}

module.exports = {
    checkHadLoadMore,
    getDownloadUrls,
    getPostUrls
}