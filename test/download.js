// test

var express = require('express');
var assert = require('chai').assert;
var download = require('../lib/download');
var conf = require('../conf/conf');

var app;
var server;
var baseURL;

describe('download', function() {
    before(function() {
        app = express();
        app.use('/static', express.static('./static'));
        server = app.listen(conf.server.port);
        baseURL = 'http://' + server.address().address + ':' + conf.server.port + '/static/';
    });
    
    describe('#image', function() {
        it('should fail to download a non-existent file', function(done) {
            download.image(baseURL + 'johndoe.jpg', function(error) {
                assert.isNotNull(error, 'error should not be null');
                done();
            });
        });
    });
    
    after(function() {
        server.close();
    });
});
