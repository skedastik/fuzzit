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

var download = {};

module.exports = download;

download.image = function(url, callback) {
    var extension = url.match(/^.*(\..+)$/)[1] || '';
    var path = conf.tempPath + generateUUID() + extension;
    
    /* TODO: generate errors for 404, etc. */
    
    request
        .get(url)
        .pipe(fs.createWriteStream(path))
        .on('finish', function(response) {
            callback(null, path);
        })
        .on('error', function(error) {
            console.log('***************** PIPE ERROR ******************');
            callback(error);
        });
};

download.multiple = function(urls, callback) {
    async.map(urls, download.image, callback);
};
