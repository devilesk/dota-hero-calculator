function ViewModel(params) {
    console.log('ViewModel stat3');
    var self = this;
    self.hero = params.hero;
    self.stat = params.stat;
    if (params.formatter instanceof Function) {
        self.formatter = params.formatter;
    }
    else if (params.formatter == 'percent') {
        self.formatter = function (value) {
            return parseFloat((value * 100).toFixed(2)) + '%';
        }
    }
    else {
        self.formatter = function (value) {
            return parseFloat(value.toFixed(2)).toString();
        }
    }
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

module.exports = {
    viewModel: ViewModel,
    template: require('fs').readFileSync(__dirname + '/../../components/stats/stat3.html', 'utf8')
};