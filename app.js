var express = require('express');
var async = require('async');
var phash = require('phash-image');
var _ = require('underscore');
var conf = require('./conf/conf');

var app = express();

app.use('/static', express.static('./static'));

app.get('/', function(request, response) {
    var url = request.query.url;
    
    if (typeof url == 'string') {
        response.send('Done.');
    } else {
        // TODO: appropriate error response code
        response.send('[]');
    }
    
    // async.waterfall([
    //     async.apply(downloadFiles, urls),
    //     deriveFingerprints,
    //     processFingerprints
    // ]);
});

var server = app.listen(conf.server.port, function() {
    console.log('Listening on port ' + conf.server.port + '...');
});

/** 
 * TODO: Processing should be distributed across a worker cluster.
 **/

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
