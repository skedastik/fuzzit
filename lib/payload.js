function asJSON(hashes) {
    return JSON.stringify({
        'hashes': hashes
    })
}

module.exports = {
    'asJSON': asJSON
};