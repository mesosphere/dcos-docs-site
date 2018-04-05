#!/bin/node

/* Usage: Script to compress images
 ** Description: Images now will be compressed before going into Pandoc
 */
const path = require('path');

const dir = process.argv[2];

// expression to identify the files we want to process
const fileRX = new RegExp(/.*\/(img)/g);

const imagemin = require('imagemin');

const mozJpeg = require('imagemin-mozjpeg');

const gifsicle = require('imagemin-gifsicle');

const svgo = require('imagemin-svgo');

const pngquant = require('imagemin-pngquant');

imagemin(['./pages/**/*.{jpeg,jpg,png,svg,gif}'], './pages/', {
  plugins: [
    mozJpeg(),
    gifsicle(),
    svgo(),
    pngquant(),
  ],
}).then((files) => {
  console.log(files);
}, (error) => {
  console.log(error);
});