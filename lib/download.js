/**
 * Because the libphash interface requires a local file path, we are forced to 
 * download images locally before processing. This is terribly inefficient, but
 * patching libphash to read directly from buffered memory is nontrivial.
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
    async.waterfall([
        async.apply(validate, url),
        function(fileExtension, callback) {
            var path = conf.downloadPath + generateUUID() + '.' + fileExtension;
            
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
    ], callback);
};

download.multiple = function(urls, callback) {
    async.map(urls, download.image, callback);
};

// callback is passed an error and a file extension
function validate(url, callback) {
    request.head(url, function(error, response) {
        if (error) {
            callback(error);
        } else if (response.statusCode != 200) {
            callback('Bad HTTP response: ' + response.statusCode);
        } else {
            var contentType = response.headers['content-type'];
            var topLevelType = contentType.match(/^([^\/]+)\//)[1];
            
            if (topLevelType !== 'image') {
                callback('Invalid content-type `' + topLevelType + '`. Only `image` allowed.');
            } else  if (response.headers['content-length'] > conf.contentLengthLimit) {
                callback('Content-length too large (' + topLevelType + '). Maximum is ' + conf.contentLengthLimit + '.');
            } else {
                callback(null, mime.extension(contentType));
            }
        }
    });
}
