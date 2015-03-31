// TODO: Clear var/ after processing
// TODO: Logging
// TODO: Clustering
// TODO: Caching

var express = require('express');
var async = require('async');
var conf = require('./conf/conf');
var download = require('./lib/download');
var fingerprint = require('./lib/fingerprint');
var Payload = require('./lib/payload');

var app = express();
var server = app.listen(conf.server.port);

app.get('/', function(request, response) {
    var encodedUrl = request.query.url;
    
    try {
        var url = JSON.parse(decodeURIComponent(encodedUrl));
    } catch (e) {
        return handleBadRequest(response);
    }
    
    async.map(
        Array.isArray(url) ? url : [url],
        process,
        async.apply(handleOk, response)
    );
});

function handleOk(response, error, result) {
    var payload = new Payload(result);
    response.send(payload.asJSON());
}

function handleBadRequest(response) {
    response
        .status(400)
        .send('Bad Request');
}

function process(url, callback) {
    async.waterfall([
        async.apply(download.image, url),
        processDownload
    ], function(error, result) {
        if (error) return handleProcessingError(error, callback);
        callback(null, result);
    });
}

function processDownload(fileInfo, callback) {
    fingerprint.derive(fileInfo.path, function(error, hash) {
        if (error) return handleProcessingError(error, callback);
        callback(null, {
            hash: hash,
            headers: fileInfo.headers
        });
    });
}

function handleProcessingError(error, callback) {
    callback(null, {
        error: error
    });
}

module.exports = {
    'app': app,
    'server': server
}
