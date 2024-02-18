# Boosty Crawler
A simple command line crawler for downloading image from boosty.to

## Requirment
NodeJS v18.0 or higher

## Usage

1. switch to project folder, run: npm install / yarn install
2. Copy config.sample.json to config.json
3. Login boosty.to
4. Input the cookie string of boosty.to and target author url. To know how to get cookie, read this: https://stackoverflow.com/questions/10014996/how-do-you-check-cookies-using-chrome
5. Run loadPost.js (node loadPost.js), wait for complete.
6. Run downloadImage.js (node downloadImage.js)
7. Then all of the image will save to "image" folder.