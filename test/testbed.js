// reusable testbed

'use strict';

var express = require('express');
var assert = require('chai').assert;

var bed = function() {
    var app;
    var server;
    var port = 3000;
    var staticBaseURL;
    
    function setup() {
        app = express();
        app.use('/static', express.static('./static'));
        server = app.listen(port);
        staticBaseURL = 'http://127.0.0.1:' + port + '/static/';
    }
    
    function teardown() {
        server.close();
    }
    
    function getStaticBaseURL() {
        return staticBaseURL;
    }
    
    return {
        'setup': setup,
        'teardown': teardown,
        'getStaticBaseURL': getStaticBaseURL
    };
};

module.exports = bed();
