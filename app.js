var express = require('express');
var async = require('async');
var conf = require('./conf/conf');

var app = express();

app.get('/', function(request, response) {
    var url = request.query.url;
    
    if (typeof url == 'string') {
        // TODO: send fingerprints
        response.send('[]');
    } else {
        // TODO: appropriate error response code
        response.send('[]');
    }
});

var server = app.listen(conf.server.port);
