var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');
var httpHelp = require('./http-helpers');



// require more modules/folders here!
// var index = fs.readFileSync(path.join(__dirname, './', 'public/index.html'));
// var loading = fs.readFileSync(path.join(__dirname, './', 'public/loading.html'));
// var styles = fs.readFileSync(path.join(__dirname, './', 'public/styles.css'));


exports.handleRequest = function (req, res) {
  if(req.url ==='/'){
    httpHelp.serveAssets(res, 'public/index.html');
    // res.writeHeader(200,{'Content-Type' : 'text/html'})
    // res.end(index);
  }





  // var parts = url.parts(req.url);
  // var pathname;
  // if (parts.pathname === '/') {
  //   pathname = '/index.html';
  // } else {
  //   pathname = parts.pathname;
  // }



  if(req.method === 'POST'){
    // res.writeHeader(201, {"Content-Type" : "text/html"});
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
              fs.readFile(path.join(__dirname, './', '../archives/sites/' + dataString + '.html'), function(data) {
                res.end(data); //maybe need to parse? -Ryan
              });
            }
          });
        }
      });
    });
    httpHelp.serveAssets(res, 'public/loading.html');
    // res.end(loading);
  }
  res.end();
};
