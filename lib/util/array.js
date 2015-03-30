module.exports = {
    extract: extract
};

// given array of objects w/ prop, return array of values mapping to given prop
function extract(arr, prop) {
    return arr.map(function (obj) { return obj[prop]; });
}