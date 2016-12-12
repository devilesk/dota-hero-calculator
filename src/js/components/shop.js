function ViewModel(params) {
    var self = this;
    self.windowWidth = params.windowWidth;
    self.windowHeight = params.windowHeight;
    self.displayShop = params.displayShop;
    self.displayShopItemTooltip = params.displayShopItemTooltip;
    self.shopDock = params.shopDock;
    self.shopDockTrigger = params.shopDockTrigger;
    self.shopPopout = params.shopPopout;
    self.selectedItem = params.selectedItem;
    self.addItem = params.addItem;
    self.changeSelectedItem = params.changeSelectedItem;
    self.getItemTooltipData = params.getItemTooltipData;
    self.getItemInputLabel = params.getItemInputLabel;
    self.itemInputValue = params.itemInputValue;
    self.itemOptions = params.itemOptions;
}

module.exports = {
    viewModel: ViewModel,
    template: require('fs').readFileSync(__dirname + '/../components/shop.html', 'utf8')
};