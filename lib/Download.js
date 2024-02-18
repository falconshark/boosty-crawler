const fs = require('fs');
const https = require('https');

//Code from https://gist.github.com/gkhays/fa9d112a3f9ee61c6005136ebda2a6fd
function downloadFile(filename, url) {
    let localFile = fs.createWriteStream(`./S/${filename}`);
    https.get(url, function (response) {
        var len = parseInt(response.headers['content-length'], 10);
        var cur = 0;
        var total = len / 1048576; //1048576 - bytes in 1 Megabyte

        response.on('data', function (chunk) {
            cur += chunk.length;
            _showProgress(filename, cur, len, total);
        });

        response.on('end', function () {
            console.log("Download complete");
        });

        response.pipe(localFile);
    });
}
function _showProgress(file, cur, len, total) {
    console.log("Downloading " + file + " - " + (100.0 * cur / len).toFixed(2)
        + "% (" + (cur / 1048576).toFixed(2) + " MB) of total size: "
        + total.toFixed(2) + " MB");
}

module.exports = {
    downloadFile,
}