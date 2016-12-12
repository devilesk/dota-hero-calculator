'use strict';
var $ = require('jquery');
//require('jquery-ui');
require('jquery-ui/ui/version');
require('jquery-ui/ui/widget');
require('jquery-ui/ui/unique-id');
require('jquery-ui/ui/safe-active-element');
require('jquery-ui/ui/keycode');
require('jquery-ui/ui/position');
require('jquery-ui/ui/focusable');
require('jquery-ui/ui/tabbable');
require('jquery-ui/ui/plugin');
require('jquery-ui/ui/ie');
require('jquery-ui/ui/data');
require('jquery-ui/ui/scroll-parent');
require('jquery-ui/ui/disable-selection');
require('jquery-ui/ui/safe-blur');
require('jquery-ui/ui/widgets/button');
require('jquery-ui/ui/widgets/spinner');
require('jquery-ui/ui/widgets/menu');
require('jquery-ui/ui/widgets/autocomplete');
require('jquery-ui/ui/widgets/mouse');
require('jquery-ui/ui/widgets/draggable');
require('jquery-ui/ui/widgets/resizable');
require('jquery-ui/ui/widgets/dialog');

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