define(["rollbar","jquery"],function(e,t){function n(e){i.length>10&&i.shift(),i.push(e)}function a(e,t){return function(){var a=this,r={eventName:t};return a.id&&(r.id=a.id),a.src&&(r.src=a.src),a.className&&(r.className=a.className),a.textContent&&(r.textContent=a.textContent),a.nodeName&&(r.nodeName=a.nodeName),a.getAttribute("data-bind")&&(r["data-bind"]=a.getAttribute("data-bind")),n(r),e.apply(this,arguments)}}function r(e,t,n,a,r){var c=e[t];return e[t]=function(){return-1!=r.indexOf(arguments[0])&&(arguments[n]=a(arguments[n],arguments[0])),c.apply(this,arguments)},c}var c={accessToken:"de1980fcab4849d6a7a066cf098a6521",captureUncaught:!0,payload:{environment:"development",client:{javascript:{source_map_enabled:!0,code_version:"cbc00eb5534f53ba3b35640c4eb0a9d8b5fb763e",guess_uncaught_frames:!0}}}},s=e.init(c),i=[];return r(Element.prototype,"addEventListener",1,a,["click","focus","blur","change","dblclick"]),{rollbar:s,userActions:i}});
//# sourceMappingURL=errorTracker.js.map