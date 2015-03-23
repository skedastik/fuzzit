// test

var assert = require('chai').assert;
var download = require('../lib/download');
var testbed = require('./testbed');
var conf = require('../conf/conf');

describe('download', function() {
    before(function() {
        testbed.setup();
    });
    
    describe('#image', function() {
        it('should fail when given a bad URL', function(done) {
            download.image('borktp://lol', function(error) {
                assert.ok(error);
                done();
            });
        });
        
        it('should fail for a non-existent file', function(done) {
            download.image(testbed.getStaticBaseURL() + 'johndoe.jpg', function(error) {
                assert.ok(error);
                done();
            });
        });

        it('should fail for a non-image file', function(done) {
            download.image(testbed.getStaticBaseURL() + 'textfile.txt', function(error) {
                assert.ok(error);
                done();
            });
        });

        it('should fail for an image larger than ' + conf.contentLengthLimit + ' bytes', function(done) {
            download.image(testbed.getStaticBaseURL() + 'large_image-john_singer_sargent.jpg', function(error) {
                assert.ok(error);
                done();
            });
        });

        it('should download a valid image', function(done) {
            download.image(testbed.getStaticBaseURL() + 'latrobe.jpg', function(error, path) {
                assert.notOk(error);
                done();
            });
        });
    });
    
    describe('#multiple', function() {
        it('should download multiple valid images', function(done) {
            download.multiple(
                [
                    testbed.getStaticBaseURL() + 'latrobe.jpg',
                    testbed.getStaticBaseURL() + 'england.jpg'
                ],
                function(error, paths) {
                    assert.notOk(error);
                    done();
                }
            );
        });
    });
    
    after(function() {
        testbed.teardown();
    });
});
