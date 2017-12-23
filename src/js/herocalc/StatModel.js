var StatModel = function (value, label, id) {
    this.components = [];
    this.total = 0;
    this.add(value, label, id);
}

StatModel.prototype.push = function (value, label, id) {
    this.components.push({
        value: value,
        label: label,
        id: id
    });
}

StatModel.prototype.add = function (value, label, id) {
    if (value) {
        console.log('add', value, label, id);
        this.push(value, label, id);
        this.total += value;
    }
    return this;
}

StatModel.prototype.mult = function (value, label, id) {
    if (value) {
        this.push(value, label, id);
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