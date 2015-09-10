var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.realPath = function(path){
  return path.join(__dirname,'./',path);
}

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  fs.readFile(path.join(__dirname,'./','../archives/sites.txt'),"utf-8", function(err, data){
    if(err){throw err}
    cb(data.split('\n'));
  });
};

// exports.readListOfUrls(function(d){console.log(d); });



exports.isUrlInList = function(url, cb) {
  exports.readListOfUrls(function(d){
    cb(_.contains(d, url));
  });
};
// exports.isUrlInList('www.homestarrunner.com', function(d){console.log(d, '<< should be true that homestarrunner is present.')});




exports.addUrlToList = function(url) {
  exports.isUrlInList(url, function(contains){
    if(!contains){
      fs.appendFile(path.join(__dirname,'./','../archives/sites.txt'),url+'\n');
    }
  });
};
// exports.addUrlToList('www.neopets.com');
// exports.isUrlInList('www.neopets.com', function(d){console.log(d,'<<< should be true if add to list works')});




exports.isUrlArchived = function(url, cb) {
  fs.open(path.join(__dirname,'./','../archives/sites/'+ url +'.html'), 'r', function(err, data){
    if(!err){
      cb( Boolean(data) );
    }else{
      cb(false);
    }
  });
};

// exports.isUrlArchived('www.amazon.com', function(d){ console.log(d,'<< should be true if isUrlArchived works')});



exports.downloadUrls = function() {
  exports.readListOfUrls(function(arr){
    _.each(arr, function(url){
      exports.isUrlArchived(url, function(archived){
        if(!archived){
          newUrl = 'http://' + url;
          request(newUrl, function(err, response, body) {
            if (!err && response.statusCode === 200) {
              fs.writeFile(path.join(__dirname,'./','../archives/sites/' + url + '.html'), body, function(err){
                if(err){ throw err; }
              });
            }
          })
        }
      });
    });
  });
};


