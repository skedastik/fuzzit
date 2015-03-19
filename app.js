var express = require('express');
var async = require('async');
var request = require('request');
var fs = require('fs');
var phash = require('phash-image');
var _ = require('underscore');

var conf = require('./conf/conf');
var generateUUID = require('./lib/util/generateUUID');

var app = express();

app.get('/', function(request, response) {
    // async.waterfall([
    //     async.apply(downloadFiles, urls),
    //     deriveFingerprints,
    //     processFingerprints
    // ]);
    
    response.send('Done.');
});

var server = app.listen(3000, function() {
    console.log('Listening on port 3000...');
});

/**
 * Because the libphash interface requires a local file path, we are forced to 
 * download the images to `var/` before processing. This is terribly 
 * inefficient, but patching libphash to read directly from buffered memory is 
 * very nontrivial.
 * 
 * TODO: Processing should be distributed across a worker cluster.
 **/
function downloadFiles(urls, callback) {
    async.map(urls, downloadSingle, callback);
}

function downloadSingle(url, callback) {
    var extension = url.match(/^.*(\..+)$/)[1] || '';
    var path = conf.tempPath + generateUUID() + extension;
    
    request
        .get(url)
        .pipe(fs.createWriteStream(path))
        .on('finish', function(response) {
            callback(null, path);
        })
        .on('error', function(error) {
            callback(error);
        });
}

function deriveFingerprints(imagePaths, callback) {
    async.map(
        imagePaths,
        _.partial(phash, _, true, _),       // generate ulong64 as string
        callback
    );
}

function processFingerprints(hashes, callback) {
    console.log('Generated hashes: ' + hashes);
    callback(null, hashes);
}
