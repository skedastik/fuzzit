var conf = {
    server: {
        port: 3000
    },
    
    // fingerprint string encoding
    hashEncoding: 'hex',
    
    // maximum input image size in octets
    contentLengthLimit: (1 << 20) * 3,
    
    downloadPath: 'var/'
};

module.exports = conf;
