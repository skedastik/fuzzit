// TODO: Clear var/ after processing
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
    var encodedUrl = request.query.url;
    
    if (typeof encodedUrl == 'string') {
        var url = JSON.parse(decodeURIComponent(encodedUrl));
        var tasks;
        
        if (Array.isArray(url)) {
            // NOTE: If a single download fails, the entire request fails :(
            tasks = [
                async.apply(download.multiple, url),
                fingerprint.deriveMultiple,
            ];
        } else {
            tasks = [
                async.apply(download.image, url),
                fingerprint.derive,
            ];
        }
        
        async.waterfall(tasks, async.apply(handleOk, response));
    } else {
        response
            .status(400)
            .send('Bad Request.');
    }
});

function handleOk(response, error, hashes) {
    if (error) {
        response
            .status(500)
            .send('Error: ' + error);
    } else {
        response.send(JSON.stringify({
            'hashes': Array.isArray(hashes) ? hashes : [hashes]
        }));
    }
}

module.exports = {
    'app': app,
    'server': server
}
