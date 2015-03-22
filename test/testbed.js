// reusable testbed

var express = require('express');
var assert = require('chai').assert;
var conf = require('../conf/conf');

var bed = function() {
    var app;
    var server;
    var staticBaseURL;
    
    function setup() {
        app = express();
        app.use('/static', express.static('./static'));
        server = app.listen(conf.server.port);
        staticBaseURL = 'http://0.0.0.0:' + conf.server.port + '/static/';
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
