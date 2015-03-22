var conf = {
    server: {
        port: 3000
    },
    
    // maximum input image size in octets
    contentLengthLimit: (1 << 20) * 3,
    
    tempPath: 'var/'
};

module.exports = conf;
