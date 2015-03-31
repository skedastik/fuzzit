module.exports = Payload;

// single code path for normalizing HTTP payloads
function Payload(data) {
    if (!Array.isArray(data)) throw 'Payload must be an array.';
    this.data = data;
}

Payload.prototype.asJSON = function(results) {
    return JSON.stringify(this.data, null, 4);
}