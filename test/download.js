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
        it('should fail for a non-existent file', function(done) {
            download.image(baseURL + 'johndoe.jpg', function(error) {
                assert.isNotNull(error, 'error should not be null');
                done();
            });
        });
        
        it('should fail for a non-image file', function(done) {
            download.image(baseURL + 'textfile.txt', function(error) {
                assert.isNotNull(error, 'error should not be null');
                done();
            });
        });
        
        it('should fail for an image larger than ' + conf.contentLengthLimit + ' bytes', function(done) {
            download.image(baseURL + 'large_image-john_singer_sargent.jpg', function(error) {
                assert.isNotNull(error, 'error should not be null');
                done();
            });
        });
        
        it('should download a valid image', function(done) {
            download.image(baseURL + 'england.jpg', function(error) {
                assert.isNull(error, 'error should be null');
                done();
            });
        });
    });
    
    after(function() {
        server.close();
    });
});
