var isString = function (myVar) {
    return typeof myVar === 'string' || myVar instanceof String;
}

module.exports = isString;