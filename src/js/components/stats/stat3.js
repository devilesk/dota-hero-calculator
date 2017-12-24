function ViewModel(params) {
    console.log('ViewModel stat3');
    var self = this;
    self.hero = params.hero;
    self.stat = params.stat;
    self.formatter = self.getFormatter(params.formatter);
    self.text = ko.pureComputed(function () {
        return self.formatter(self.hero[self.stat]());
    }, this, { deferEvaluation: true });
    self.diffText = ko.pureComputed(function () {
        var value = self.hero[self.stat]() - self.hero.heroCompare()[self.stat]();
        if (value > 0) {
            return '+' + self.formatter(value);
        }
        else if (value < 0) {
            return '&minus;' + self.formatter(value*-1);
        }
        else {
            return '';
        }
    }, this, { deferEvaluation: true });
}

ViewModel.prototype.getFormatter = function (formatter) {
    if (formatter instanceof Function) {
        return formatter;
    }
    else if (formatter == 'percent') {
        return function (value) {
            return parseFloat((value * 100).toFixed(2)) + '%';
        }
    }
    else {
        return function (value) {
            return parseFloat(value.toFixed(2)).toString();
        }
    }
}

module.exports = {
    viewModel: ViewModel,
    template: require('fs').readFileSync(__dirname + '/../../components/stats/stat3.html', 'utf8')
};