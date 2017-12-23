var Stat3Model = require("./stat3").viewModel;

function ViewModel(params) {
    console.log('ViewModel stat2');
    var self = this;
    Stat3Model.call(this, params);
    
    self.text = ko.pureComputed(function () {
        return self.formatter(self.hero[self.stat]().total);
    }, this, { deferEvaluation: true });
    
    self.tooltip = ko.pureComputed(function () {
        console.log('stat', self.stat);
        return '<table class="table"><tbody>' + self.hero[self.stat]().components.reduce(function (memo, component) {
            return memo += '<tr><td>' + component.label + '</td><td class="text-right">' + parseFloat(component.value.toFixed(2)) + '</td></tr>';
        }, '') + '</tbody></table>';
    }, this, { deferEvaluation: true });
}
ViewModel.prototype = Object.create(Stat3Model.prototype);
ViewModel.prototype.constructor = ViewModel;

module.exports = {
    viewModel: ViewModel,
    template: require('fs').readFileSync(__dirname + '/../../components/stats/stat2.html', 'utf8')
};