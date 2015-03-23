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
            var writeStream = fs.createWriteStream(path);
            var successHandler = function() {
                callback(null, path);
            };
            var errorHandler = function(error) {
                // remove 'finish' listener to avoid invoking callback twice
                writeStream.removeListener('finish', successHandler);
                // explicitly end stream to avoid open descriptors
                writeStream.end();
                callback(error);
            };
            request
                .get(url)
                .on('error', errorHandler)
                .pipe(writeStream)
                .on('error', errorHandler)
                .on('finish', successHandler);
        }
        
    ], callback);
};

download.multiple = function(urls, callback) {
    async.map(urls, download.image, callback);
};

// callback is passed an error and a file extension
function validate(url, callback) {
    request.head(url, function(error, response) {
        if (error)
            return callback(error);
        
        if (response.statusCode != 200)
            return callback('Bad HTTP response: ' + response.statusCode);
        
        var contentType = response.headers['content-type'];
        var topLevelType = contentType.match(/^([^\/]+)\//)[1];
        
        if (topLevelType !== 'image')
            return callback('Invalid content-type `' + topLevelType + '`. Only `image` allowed.');
        
        if (response.headers['content-length'] > conf.contentLengthLimit)
            return callback('Content-length too large (' + topLevelType + '). Maximum is ' + conf.contentLengthLimit + '.');
        
        return callback(null, mime.extension(contentType));
    });
}
