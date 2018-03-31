const path = require('path');
const sep = require('path').sep;
const cheerio = require('cheerio');
const md = require('markdown-it')({
  typographer: true,
  html: true,
});
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

function walk(opts, file, files, array, children, level) {
  // Get path
  let pathParts = file.split(sep);
  pathParts.pop()
  let urlPath = '/' + pathParts.join('/');
  if(!level) {
    level = 0;
  }
  if(!children) {
    children = [];
  }
  let id = array[0];
  let child = children.find((c, i) => c.id === id);
  // Only parse specified file types
  let basename = path.basename(file);
  let ext = path.extname(basename);
  let shouldParse = true;
  if(opts.files) {
    shouldParse = (opts.files.indexOf(ext) == -1) ? false : shouldParse;
  }
  // Build object
  if(!child && shouldParse) {
    let child = {
      id: id,
      path: urlPath,
      children: [],
    };
    let blacklist = [
      'stats',
      'mode',
      'contents',
    ];
    let fileObj = files[file];
    // Add front-matter
    for(let key in fileObj) {
      if(blacklist.indexOf(key) === -1) {
        child[key] = fileObj[key]
      }
    }
    // Add excerpt
    if(opts.excerpt && !child.excerpt) {
      let contents = decoder.write(fileObj.contents);
      let html = (ext == '.md') ? md.render(contents) : contents;
      let $ = cheerio.load(html);
      let elem = $('p').first();
      child.excerpt = elem.text();
    }
    children.push(child);
  }
  // Walk children
  if(child && array.length > 1) {
    let childChildrenArray = array.slice(1, array.length);
    let childChildren = walk(opts, file, files, childChildrenArray, child.children, level + 1);
    child.children = childChildren;
  }
  // Sort
  children.sort((a, b) => {
    return (a.menuWeight > b.menuWeight) ? 1 : (a.menuWeight < b.menuWeight) ? -1 : 0;
  });
  return children;
}

function plugin(opts) {
  return function(files, metalsmith, done) {
    setImmediate(done);
    var findByPath = function(path) {
      path = this.xPath(path);
      if(path[0] !== '/') {
        path = '/' + path;
      }
      // Check if exists
      let listOfPaths = Object.keys(files).map(f => {
        let array = f.split(sep);
        array.pop();
        return '/' + array.join('/');
      });
      if(listOfPaths.indexOf(path) == -1) {
        return;
      }
      // Find
      var f = function(array, key, value) {
        return array.find(function(item) {
          return item[key] == value;
        });
      }
      var pathSplit = path.split('/');
      pathSplit.splice(0, 1);
      var start = f(this.children, 'id', pathSplit[0]);
      pathSplit.splice(0, 1);
      var index = 0;
      var currentPage = pathSplit.reduce(function(value, next) {
        if(value.children && value.children.length) {
          var found = f(value.children, 'id', pathSplit[index]);
          index++;
        }
        return found;
      }, start);
      return currentPage;
    }
    var find = function(key, value) {
      let found = [];
      let w = (node) => {
        let matches = node.children.filter(function(n) {
          if(!value) {
            return n[key] != undefined;
          }
          return n[key] == value;
        });
        found = found.concat(matches);
        node.children.forEach(function(n) {
          w(n);
        });
      };
      w(this);
      return found;
    }
    var findParent = function(path, key, value) {
      path = this.xPath(path);
      if(path[0] !== '/') {
        path = '/' + path;
      }
      let pathSplit = path.split('/');
      pathSplit.splice(0, 1);
      pathSplit.reverse();
      let self = this;
      let parent;
      pathSplit.forEach(function(id) {
        let i = path.split('/').indexOf(id);
        let s = path.split('/').slice(0, i + 1).join('/');
        let page = this.findByPath(s);
        if(page && page[key] && page[key] == value) {
          parent = page;
        }
      }, this);
      return parent;

    }
    var xPath = function(path) {
      // change path from platform specific separator to '/'
      var parts = path.split(sep);
      var xPath = '';
      for(i in parts){
        var xParts = parts[i].split('/');
        xPath += xParts.join('/');
        if(i < parts.length-1){
          xPath += '/'; 
        }
      }
      return xPath;
    }
    let r = {
      id: '',
      title: '',
      path: '/',
      children: [],
      findByPath: findByPath,
      findParent: findParent,
      find: find,
      xPath: xPath,
    };
    Object.keys(files).forEach(function(file, index) {
      var pathParts = file.split(sep);
      pathParts.pop();
      let children = walk(opts, file, files, pathParts, r.children, 0);
      r.children = children;
    });
    metalsmith.metadata()['hierarchy'] = r;
  };
};

module.exports = plugin;
