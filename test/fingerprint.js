// test

var assert = require('chai').assert;
var fingerprint = require('../lib/fingerprint');

describe('fingerprint', function() {
    describe('#derive', function() {
        it('should fail for a badly formatted image', function(done) {
            fingerprint.derive('static/not_an_image.jpg', function(error) {
                assert.ok(error);
                done();
            });
        });

        it('should work for a valid image', function(done) {
            fingerprint.derive('test/sample/orig.jpg', function(error) {
                assert.notOk(error);
                done();
            });
        });
    });
    
    describe('#deriveMultiple', function() {
        it('should work for multiple valid images', function(done) {
            fingerprint.deriveMultiple(
                [
                    'test/sample/orig.jpg',
                    'test/sample/orig-copy.jpg'
                ],
                function(error, hashes) {
                    assert.notOk(error);
                    done();
                }
            );
        });
        
        it('should derive identical fingerprints for identical images', function(done) {
            fingerprint.deriveMultiple(
                [
                    'test/sample/orig.jpg',
                    'test/sample/orig-copy.jpg'
                ],
                function(error, hashes) {
                    assert(hashes[0] == hashes[1]);
                    done();
                }
            );
        });
    });
});
