var StatModel = function (value, label, id, formatter) {
    this.components = [];
    this.total = 0;
    this.add(value, label, id, formatter);
}

StatModel.prototype.push = function (value, label, id, formatter) {
    this.components.push({
        value: value,
        label: label,
        id: id,
        formatter: formatter
    });
}

StatModel.prototype.add = function (value, label, id, formatter) {
    if (value) {
        this.push(value, label, id, formatter);
        this.total += value;
    }
    return this;
}

StatModel.prototype.mult = function (value, label, id, formatter) {
    if (value) {
        this.push(value, label, id, formatter);
        this.total *= value;
    }
    return this;
}

StatModel.prototype.concat = function (s) {
    this.components = this.components.concat(s.components);
    this.total += s.total;
    return this;
}

module.exports = StatModel;