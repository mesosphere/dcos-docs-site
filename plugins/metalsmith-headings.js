const cheerio = require('cheerio');
const extname = require('path').extname;

function plugin() {
  const selectors = ['h1', 'h2'];
  return function(files, metalsmith, done) {
    setImmediate(done);
    Object.keys(files).forEach(function(file) {
      if ('.html' != extname(file)) return;
      var data = files[file];
      var contents = data.contents.toString();
      var $ = cheerio.load(contents);
      data.headings = [];
      $(selectors.join(',')).each(function(){
        if ($(this).data('hide') != true) {
          data.headings.push({
            id: $(this).attr('id'),
            tag: $(this)[0].name,
            text: $(this).text()
          });
        }
      });
    });
  };
}

module.exports = plugin;