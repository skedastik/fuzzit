// TODO: Logging
// TODO: Clustering
// TODO: Caching

'use strict';

var express = require('express');
var Promise = require('bluebird');
var ghash = require('ghash');
var conf = require('./conf/conf');
var download = require('./lib/download');
var Payload = require('./lib/payload');

var app = express();
var server = app.listen(conf.server.port);

module.exports = {
    'app': app,
    'server': server
};

app.get('/', function(request, response) {
    var url = request.query.url;
    try {
        url = JSON.parse(decodeURIComponent(url));
    } catch (e) {
        return handleBadRequest(response);
    }
    Promise.map(
        Array.isArray(url) ? url : [url],
        process
    ).then(function(data) {
        var payload = new Payload(data);
        response.send(payload.asJSON());
    });
});

function process(url) {
    return download(url).then(function(data) {
        return ghash(data.path).calculate().then(function(hash) {
            return {
                hash: hash.toString(conf.hashEncoding),
                headers: data.headers
            };
        });
    }).catch(handleProcessingError);
}

function handleProcessingError(error) {
    if (error instanceof ReferenceError) {
        throw error;
    }
    return { error: error.toString() };
}

function handleBadRequest(response) {
    response
    .status(400)
    .send('Bad Request');
}