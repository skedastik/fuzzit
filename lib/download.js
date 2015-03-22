/**
 * Because the libphash interface requires a local file path, we are forced to 
 * download images to `var/` before processing. This is terribly inefficient,
 * but patching libphash to read directly from buffered memory is nontrivial.
 **/

var fs = require('fs');
var async = require('async');
var request = require('request');
var conf = require('../conf/conf');
var generateUUID = require('./util/generateUUID');
var mime = require('mime');

var download = {};

module.exports = download;

download.image = function(url, callback) {
    request.head(url, function(error, response) {
        if (error) {
            callback(error);
        } else if (response.statusCode != 200) {
            callback('Bad HTTP response: ' + response.statusCode);
        } else {
            var contentType = response.headers['content-type'];
            var topLevelType = contentType.match(/^([^\/]+)\//)[1];
            var path = conf.tempPath + generateUUID() + '.' + mime.extension(contentType);
            
            if (topLevelType !== 'image') {
                callback('Invalid content-type `' + topLevelType + '`. Only `image` allowed.');
            } else  if (response.headers['content-length'] > conf.contentLengthLimit) {
                callback('Content-length too large (' + topLevelType + '). Maximum is ' + conf.contentLengthLimit + '.');
            } else {
                request
                    .get(url)
                    .pipe(fs.createWriteStream(path))
                    .on('finish', function() {
                        callback(null, path);
                    })
                    .on('error', function(error) {
                        callback(error);
                    });
            }
        }
    });
};

download.multiple = function(urls, callback) {
    async.map(urls, download.image, callback);
};
