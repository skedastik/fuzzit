// TODO: Logging
// TODO: Caching

var express = require('express');
var async = require('async');
var conf = require('./conf/conf');
var download = require('./lib/download');
var fingerprint = require('./lib/fingerprint');

var app = express();
var server = app.listen(conf.server.port);

app.get('/', function(request, response) {
    var url = request.query.url;
    
    if (typeof url == 'string') {
        async.waterfall([
            async.apply(download.image, decodeURIComponent(url)),
            fingerprint.derive,
        ], async.apply(respond, response));
    } else {
        response
            .status(400)
            .send('Bad Request.');
    }
});

function respond(response, error, hash) {
    if (error) {
        response
            .status(500)
            .send('Error: ' + error);
    } else {
        response.send(hash);
    }
}
