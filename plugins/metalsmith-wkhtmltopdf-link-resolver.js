const cheerio = require('cheerio');
const extname = require('path').extname;

function plugin(opts) {
  return function(files, metalsmith, done) {
    setImmediate(done);
    Object.keys(files).forEach(function(file) {
      if ('.html' != extname(file)) return;
      let data = files[file];
      let contents = data.contents.toString();
      let $ = cheerio.load(contents);
      let buildPath = opts.prefix;
      $('*').each(function(){
        let href = $(this).attr('href');
        let src = $(this).attr('src');
        // Remove links
        if($(this).is('a')) {
          $(this).removeAttr('href');
        }
        // Set system file links
        else if(href && href[0] === '/') {
          $(this).attr('href', buildPath + href)
        }
        // Set system file path
        else if(src && src[0] === '/') {
          $(this).attr('src', buildPath + src)
        }
      });
      files[file].contents = Buffer.from($.html(), 'utf8');
    });
    return files;
  };
}

module.exports = plugin;