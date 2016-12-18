var abilityDamageTypes = {
    'DAMAGE_TYPE_MAGICAL': 'Magical',
    'DAMAGE_TYPE_PURE': 'Pure',
    'DAMAGE_TYPE_PHYSICAL': 'Physical',
    'DAMAGE_TYPE_COMPOSITE': 'Composite',
    'DAMAGE_TYPE_HP_REMOVAL': 'HP Removal'
}

var abilityTooltipData = ko.observable();

var getTooltipAbilityDescription = function (item) {
    var d = abilityTooltipData() ? abilityTooltipData()[item.name].description : '';
    for (var i = 0; i < item.attributes.length; i++) {
        if (item.attributes[i].name != null) {
            var attributeName = item.attributes[i].name;
            var attributeValue = item.attributes[i].value[0];
            for (var j = 1; j < item.attributes[i].value.length; j++) {
                attributeValue += ' / ' + item.attributes[i].value[j];
            }
            regexp = new RegExp('%' + attributeName + '%', 'gi');
            d = d.replace(regexp, attributeValue);
        }
    }
    var regexp = new RegExp('%%', 'gi');
    d = d.replace(regexp, '%');
    regexp = new RegExp('\n', 'gi');
    d = d.replace(/\\n/g, '<br>');
    return d;
}

function AttributeTooltip(tooltip, values, sep, suffix) {
    this.tooltip = tooltip;
    this.values = values;
    this.sep = sep || ' / ';
    this.suffix = suffix || "";
}
AttributeTooltip.prototype.toString = function () {
    var self = this;
    return this.tooltip + ' ' + this.values.map(function (v) { return v + self.suffix; }).join(this.sep);
}

var getTooltipAbilityAttributes = function (item) {
    var a = [];
    if (item.damage.length > 0 && item.damage.reduce(function(memo, num){ return memo + num; }, 0) > 0) {
        a.push(new AttributeTooltip('DAMAGE:', item.damage));
    }
    for (var i = 0; i < item.attributes.length; i++) {
        if (item.attributes[i].tooltip != null) {
            var attributeTooltip = item.attributes[i].tooltip;
            attributeTooltip = attributeTooltip.replace(/\\n/g, '');
            var suffix = '';
            if (attributeTooltip.indexOf('%') == 0) {
                attributeTooltip = attributeTooltip.slice(1);
                suffix = '%';
            }
            a.push(new AttributeTooltip(attributeTooltip, item.attributes[i].value, ' / ', suffix));
        }
    }
    return a;
}

var getTooltipAbilityManaCost = function (hero, item) {
    var c = '';
    if (item.manacost.reduce(function(memo, num){ return memo + num; }, 0) == 0) {
        return c;
    }
    if (item.manacost.every(function(num) { return num == item.manacost[0]; })) {
        return item.manacost[0].toString();
    }
    for (var i = 0; i < 4; i++) {
        if (item.manacost[i] != null) {
            c = c + ' ' + item.manacost[i];
        }
    }
    return c;
}

var getTooltipAbilityCooldown = function (hero, item) {
    var c = '';
    if (item.cooldown.reduce(function(memo, num){ return memo + num; }, 0) == 0) {
        return c;
    }
    return item.cooldown.map(function (v) {
        return parseFloat((
            v * hero.cooldownReductionProduct()
            - hero.cooldownReductionFlat()
        ).toFixed(2));
    }).join(' ');
    return c;
}

function ViewModel(params) {
    var self = this;
    self.hero = params.hero;
    self.ability = params.ability;
    self.description = ko.computed(function () {
        return getTooltipAbilityDescription(self.ability);
    });
    self.damageType = abilityDamageTypes[self.ability.abilityunitdamagetype];
    self.displayname = self.ability.displayname;
    self.lore = ko.computed(function () {
        if (abilityTooltipData()) {
            return abilityTooltipData()[self.ability.name].lore
        }
        else {
            return "";
        }
    });
    self.manacost = ko.computed(function () {
        return getTooltipAbilityManaCost(self.hero, self.ability);
    });
    self.cooldown = ko.computed(function () {
        return getTooltipAbilityCooldown(self.hero, self.ability);
    });
    self.attributes = getTooltipAbilityAttributes(self.ability);
}

module.exports = {
    viewModel: ViewModel,
    template: require('fs').readFileSync(__dirname + '/../components/ability-detail.html', 'utf8'),
    abilityTooltipData: abilityTooltipData
};