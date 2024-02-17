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
    $('.FileBlock_link_NSv4s').each(function(){
        const href = $(this).attr('href');
        downloadUrls.push(href);
    });
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