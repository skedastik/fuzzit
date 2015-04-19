'use strict';

var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var fs = require('fs');
var conf = require('../conf/conf');
var generateUUID = require('./util/generateUUID');
var mime = require('mime');

module.exports = download;

// returns a data object in a Promise
function download(url) {
    return validate(url).then(function(metadata) {
        var path = conf.downloadPath + generateUUID() + '.' + metadata.fileExtension;
        return new Promise(function (resolve, reject) {
            request.get(url)
            .on('error', reject)
            .pipe(fs.createWriteStream(path))
            .on('finish', function () {
                resolve({
                    'path': path,
                    'headers': metadata.headers
                });
            });
        });
    });
}

// returns a metadata object in a Promise
function validate(url) {
    return request.headAsync(url).spread(function(response, body) {
        if (response.statusCode != 200)
            throw new Error('Bad HTTP response: ' + response.statusCode);
        
        var headers = response.headers;
        var contentType = headers['content-type'];
        var topLevelType = contentType.match(/^([^\/]+)\//)[1];
        
        if (topLevelType !== 'image')
            throw new Error('Invalid content-type `' + topLevelType + '`. Only `image` allowed.');
        
        if (headers['content-length'] > conf.contentLengthLimit)
            throw new Error('Content-length too large (' + headers['content-length'] + '). Maximum is ' + conf.contentLengthLimit + '.');
        
        return {
            fileExtension: mime.extension(contentType),
            headers: {
                'last-modified': headers['last-modified']
            }
        };
    });
}
