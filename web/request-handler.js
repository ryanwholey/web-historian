var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');
var httpHelp = require('./http-helpers');
var qs = require('querystring');


// require more modules/folders here!
// var index = fs.readFileSync(path.join(__dirname, './', 'public/index.html'));
// var loading = fs.readFileSync(path.join(__dirname, './', 'public/loading.html'));
// var styles = fs.readFileSync(path.join(__dirname, './', 'public/styles.css'));

// setInterval(function(){console.log('archiving');archive.downloadUrls();},10000);
exports.runCron = function(){
  setInterval(function(){console.log('archiving');archive.downloadUrls();},10000);
};

exports.handleRequest = function (req, res) {
  
  if(req.url ==='/'){
    httpHelp.serveAssets(res, 'public/index.html');
    // res.writeHeader(200,{'Content-Type' : 'text/html'})
    // res.end(index);
  }

  if(req.method === 'POST'){
    
    
    var dataString = '';

    req.on('data', function(chunk){
      dataString += chunk;
    });

    req.on('end', function(){
      dataString = dataString.substring(4);
      if(dataString === ''){
        res.end();  
        return;
      }
      archive.isUrlInList(dataString, function(contains) {
        if (!contains) {
          archive.addUrlToList(dataString);
        } else {
          archive.isUrlArchived(dataString, function(archived) {
            if (archived) {
              // httpHelp.serveAssets(res, '../archives/sites/' + dataString + '.html');
              // fs.readFile(path.join(__dirname, './', '../archives/sites/' + dataString + '.html'), function(data) {
              //   res.end(data); 
              // });
            }
          });
        }
      });
      httpHelp.serveAssets(res, 'public/loading.html');
    });
    
  
  } else if(req.method === 'GET'){
    var localPath = req.url.substring(1);
    archive.isUrlArchived(localPath, function(archived){
      if(archived){
        httpHelp.serveAssets(res, '../archives/sites/' + localPath + '.html');
      } else if(req.url!== '/request-handler.js') {
        res.writeHeader(404, {'Content-Type':'text/html'});
        res.end('<!doctype html><html><body>not found</body></html>');
      }
    });
  }
  else{
  res.end();
  }
};
