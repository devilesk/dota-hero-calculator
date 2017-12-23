function ViewModel(params) {
    console.log('ViewModel stat2');
    var self = this;
    self.hero = params.hero;
    self.stat = params.stat;
    self.tooltip = ko.pureComputed(function () {
        console.log('stat', self.stat);
        return '<table class="table"><tbody>' + self.hero[self.stat]().components.reduce(function (memo, component) {
            return memo += '<tr><td>' + component.label + '</td><td class="text-right">' + parseFloat(component.value.toFixed(2)) + '</td></tr>';
        }, '') + '</tbody></table>';
    }, this, { deferEvaluation: true });
}

module.exports = {
    viewModel: ViewModel,
    template: require('fs').readFileSync(__dirname + '/../../components/stats/stat2.html', 'utf8')
};