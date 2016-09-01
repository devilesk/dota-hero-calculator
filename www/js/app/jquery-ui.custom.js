'use strict';
var $ = require('jquery');
require('jquery-ui');
require('../../../node_modules/jquery-ui/ui/version');
require('../../../node_modules/jquery-ui/ui/widget');
require('../../../node_modules/jquery-ui/ui/unique-id');
require('../../../node_modules/jquery-ui/ui/safe-active-element');
require('../../../node_modules/jquery-ui/ui/keycode');
require('../../../node_modules/jquery-ui/ui/position');
require('../../../node_modules/jquery-ui/ui/focusable');
require('../../../node_modules/jquery-ui/ui/tabbable');
require('../../../node_modules/jquery-ui/ui/plugin');
require('../../../node_modules/jquery-ui/ui/ie');
require('../../../node_modules/jquery-ui/ui/data');
require('../../../node_modules/jquery-ui/ui/scroll-parent');
require('../../../node_modules/jquery-ui/ui/disable-selection');
require('../../../node_modules/jquery-ui/ui/safe-blur');
require('../../../node_modules/jquery-ui/ui/widgets/button');
require('../../../node_modules/jquery-ui/ui/widgets/spinner');
require('../../../node_modules/jquery-ui/ui/widgets/menu');
require('../../../node_modules/jquery-ui/ui/widgets/autocomplete');
require('../../../node_modules/jquery-ui/ui/widgets/mouse');
require('../../../node_modules/jquery-ui/ui/widgets/draggable');
require('../../../node_modules/jquery-ui/ui/widgets/resizable');
require('../../../node_modules/jquery-ui/ui/widgets/dialog');

var proto = $.ui.autocomplete.prototype,
    initSource = proto._initSource;

function filter( array, term ) {
    var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
    return $.grep( array, function(value) {
        return matcher.test( $( "<div>" ).html( value.label || value.value || value ).text() );
    });
}

$.extend( proto, {
    _initSource: function() {
        if ( this.options.html && $.isArray(this.options.source) ) {
            this.source = function( request, response ) {
                response( filter( this.options.source, request.term ) );
            };
        } else {
            initSource.call( this );
        }
    },

    _renderItem: function( ul, item) {
        return $( "<li></li>" )
            .data( "item.autocomplete", item )
            .append( $( "<a></a>" )[ this.options.html ? "html" : "text" ]( item.label ) )
            .appendTo( ul );
    }
});