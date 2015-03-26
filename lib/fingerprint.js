var async = require('async');
var phash = require('phash-image');
var conf = require('../conf/conf');

var fingerprint = function() {
    var zeroBuffer = new Buffer([0,0,0,0,0,0,0,0]);
    
    function derive(imagePath, callback) {
       /**
        * 2015.22.3
        * node-phash version 3.1.0
        * phash makes use of CImg. CImg has a tendency to swallow exceptions 
        * For instance, phash will fail to report a `CImgIOException` if a badly
        * formatted image is supplied as input (instead, it logs it directly to
        * console). This makes the `error` argument supplied to this callback
        * unreliable, so we also check `hash`, which is a 64-bit Buffer object.
        * If `hash` is a zero-filled buffer, we report an error. This is
        * brittle, but it's the best we can do.
        **/
        phash(imagePath, function(error, hash) {
            if (error)
                return callback(error);
            
            if (hash.compare(zeroBuffer) === 0)
                return callback('Unknown phash error');
                
            callback(null, hash.toString(conf.hashEncoding));
        });
    }
    
    function deriveMultiple(imagePaths, callback) {
        async.map(imagePaths, derive, callback);
    }
    
    return {
        'derive': derive,
        'deriveMultiple': deriveMultiple
    };
};

module.exports = fingerprint();
