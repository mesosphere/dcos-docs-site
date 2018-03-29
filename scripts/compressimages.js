#!/bin/node
/* Usage: Script to compress images
** Description: Images now will be compressed before going into Pandoc
*/
const path = require('path');

const dir = process.argv[2];

// expression to identify the files we want to process
const fileRX = new RegExp(/.*\/(img)/g);

const compress_images = require('compress-images');

// Function to do the compression
function compressor() {
  compress_images(`${dir}/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}`, `${dir}/`, { compress_force: false, statistic: true, autoupdate: true }, false,
    { jpg: { engine: 'mozjpeg', command: ['-quality', '60'] } },
    { png: { engine: 'pngquant', command: ['--quality=20-50'] } },
    { svg: { engine: 'svgo', command: '--multipass' } },
    { gif: { engine: 'gifsicle', command: ['--colors', '64', '--use-col=web'] } }, () => {
      console.log('it compressed', `${dir}/`);
    });
}

compressor();
