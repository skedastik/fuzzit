// TODO: Clear var/ after processing
// TODO: Logging
// TODO: Clustering
// TODO: Caching

var express = require('express');
var async = require('async');
var conf = require('./conf/conf');
var download = require('./lib/download');
var fingerprint = require('./lib/fingerprint');
var payload = require('./lib/payload');
var au = require('./lib/util/array');

var app = express();
var server = app.listen(conf.server.port);

app.get('/', function(request, response) {
    var encodedUrl = request.query.url;
    
    try {
        var url = JSON.parse(decodeURIComponent(encodedUrl));
    
        // NOTE: If a single download fails, the entire request fails :(
        async.waterfall([
            async.apply(download.multiple, Array.isArray(url) ? url : [url]),
            processDownloads,
        ], async.apply(handleOk, response));
    } catch (e) {
        handleBadRequest(response);
    }
});

function handleOk(response, error, results) {
    if (error) {
        response
            .status(500)
            .send('Error: ' + error);
    } else {
        response.send(payload.asJSON(results));
    }
}

function handleBadRequest(response) {
    response
        .status(400)
        .send('Bad Request');
}

function processDownloads(fileInfos, callback) {
    var filePaths = au.extract(fileInfos, 'path');
    fingerprint.deriveMultiple(filePaths, function(error, hashes) {
        if (error) return callback(error);
        
        var results = [];
        for (var i = 0; i < fileInfos.length; i++) {
            var info = {
                hash: hashes[i],
                headers: fileInfos[i].headers
            };
            results.push(info);
        }
        
        callback(null, results);
    });
}

module.exports = {
    'app': app,
    'server': server
}
