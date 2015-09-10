// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
// var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// var url = require('url');
// var httpHelp = require('./http-helpers');

(function(){
  archive.downloadUrls();
})();