var UnitOption = function (name, displayname, levels, image, level) {
    this.heroName = ko.computed(function() {
        return (levels > 0) ? name + (level() <= levels ? level() : 1) : name;
    });
    this.heroDisplayName = displayname;
    this.image = image;
    this.levels = levels;
};

module.exports = UnitOption;