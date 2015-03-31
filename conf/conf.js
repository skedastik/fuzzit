var conf = {
    server: {
        port: process.env.PORT || 3000
    },
    
    // fingerprint string encoding
    hashEncoding: 'hex',
    
    // maximum input image size in octets
    contentLengthLimit: (1 << 20) * 1
};

module.exports = conf;
