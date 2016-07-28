/**
 * Performance reporting for Knockout binding handlers
 *
 * Usage: Include after all bindings are declared, view console for results.
 */
define(['require','exports','module','herocalc_knockout','underscore'],function (require, exports, module) {
    'use strict';
    var ko = require('herocalc_knockout');
    var _ = require('underscore');

   var report = [];
   var lastReport = 0;
   var debounceWait = 500;

   var viewReport = _.debounce(function () {
      if (report.length) {
         report = _.sortBy(report, "totalDuration").reverse();

         _.each(report, function(r) {
            r.entries = _.sortBy(r.entries, "duration").reverse();
         });

         var worst = _.max(report, function (r) {
            return r.totalDuration;
         });
         var total = _.reduce(report, function (memo, r) {
            return memo + r.totalDuration;
         }, 0);

         var levels = [
            { min: 0, max: 50, style: "background-color: green; color: white;" },
            { min: 51, max: 150, style: "background-color: orange; color: white;" },
            { min: 151, max: 99999, style: "background-color: red; color: white;" }
         ];

         var getLevel = function (v) {
            return _.find(levels, function (def) {
               return v >= def.min && v <= def.max;
            }).style;
         };

         console.log("%cKnockout Binding Report", "background-color: yellow; font-size: 2em;");
         console.log("Report Date:", new Date().toISOString(), "(+" + (new Date().getTime() - debounceWait - lastReport) + "ms)");
         console.log("%cTotal: " + total + "ms", getLevel(total));
         console.log("%cTop: " + worst.handler + " (" + worst.totalDuration + "ms)", getLevel(worst.totalDuration));

         console.table(report);

         report = [];
         lastReport = new Date().getTime();
      }
   }, debounceWait);

   var getWrapper = function (bindingName) {
      return function(fn, element, valueAccessor, allBindings, viewModel, bindingContext) {
         var st = new Date().getTime();

         var result = fn(element, valueAccessor, allBindings, viewModel, bindingContext);

         var duration = new Date().getTime() - st;
         var handlerReport = _.findWhere(report, { handler: bindingName });

         if (!handlerReport) {
            handlerReport = {
               handler: bindingName,
               totalDuration: 0,
               entries: []
            };
            report.push(handlerReport);
         }

         handlerReport.totalDuration += duration;
         handlerReport.entries.push({
            element: element,
            binding: (element.attributes && element.attributes["data-bind"]) || element.nodeValue || "",
            duration: duration
         });
         
         viewReport();

         return result;
      };
   };

   _.each(ko.bindingHandlers, function (binding, name) {
      if (binding.init) binding.init = _.wrap(binding.init, getWrapper(name + ".init"));
      if (binding.update) binding.update = _.wrap(binding.update, getWrapper(name + ".update"));
   });

});