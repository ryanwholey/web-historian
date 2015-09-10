var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');


// require more modules/folders here!

var index = fs.readFileSync(path.join(__dirname, './', 'public/index.html'));
var loading = fs.readFileSync(path.join(__dirname, './', 'public/loading.html'));
var styles = fs.readFileSync(path.join(__dirname, './', 'public/styles.css'));

exports.handleRequest = function (req, res) {
  if(req.url ==='/'){
    res.writeHeader(200, {"Content-Type" : "text/html"});
    res.end(index);
  }

  if(req.method === 'POST'){
    res.writeHeader(201, {"Content-Type" : "text/html"});
    var dataString = '';

    req.on('data', function(chunk){
      console.log('chunk',chunk);
      dataString += chunk;
    });
    req.on('end', function(){
      console.log(typeof dataString)
      dataString = dataString.substring(4);
      console.log(dataString);

      if(dataString === ''){
        res.end();  
        return;
      }
      




    //   fs.open(path.join(__dirname,'./','../archives/sites.txt'), 'a', function(err, fd){
    //     fs.write(fd, dataString + "\n");
    //     fs.close(fd);
    //   });


    });
    res.end(loading);
  }



  res.end();
};
