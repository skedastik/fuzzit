module.exports = {
    asJSON: asJSON
};

function asJSON(results) {
    return JSON.stringify({
        'results': results
    })
}