// test

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var download = require('../lib/download');
var testbed = require('./testbed');
var conf = require('../conf/conf');

chai.use(chaiAsPromised);
chai.should();

describe('download', function() {
    before(function() {
        testbed.setup();
    });
    
    describe('#image', function() {
        it('should fail when given a bad URL', function() {
            return download('borktp://lol').should.eventually.be.rejected;
        });
        
        it('should fail for a non-existent file', function() {
            return download(testbed.getStaticBaseURL() + 'johndoe.jpg').should.eventually.be.rejected;
        });

        it('should fail for a non-image file', function() {
            return download(testbed.getStaticBaseURL() + 'textfile.txt').should.eventually.be.rejected;
        });

        it('should fail for an image larger than ' + conf.contentLengthLimit + ' bytes', function() {
            return download(testbed.getStaticBaseURL() + 'large_image-john_singer_sargent.jpg').should.eventually.be.rejected;
        });
       
        it('should download a valid image', function() {
            return download(testbed.getStaticBaseURL() + 'latrobe.jpg').should.be.fulfilled;
        });
    });
    
    after(function() {
        testbed.teardown();
    });
});
