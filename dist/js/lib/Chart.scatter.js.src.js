define(['chartjs'], function(Chart) {
    Chart.types.Line.extend({
        // Passing in a name registers this chart in the Chart namespace in the same way
        name: "Scatter",
        draw : function(ease){
                var easingDecimal = ease || 1;
                this.clear();

                var ctx = this.chart.ctx;

                // Some helper methods for getting the next/prev points
                var hasValue = function(item){
                    return item.value !== null;
                },
                nextPoint = function(point, collection, index){
                    return Chart.helpers.findNextWhere(collection, hasValue, index) || point;
                },
                previousPoint = function(point, collection, index){
                    return Chart.helpers.findPreviousWhere(collection, hasValue, index) || point;
                };

                this.scale.draw(easingDecimal);


                Chart.helpers.each(this.datasets,function(dataset){
                    var pointsWithValues = Chart.helpers.where(dataset.points, hasValue);

                    //Transition each point first so that the line and point drawing isn't out of sync
                    //We can use this extra loop to calculate the control points of this dataset also in this loop

                    Chart.helpers.each(dataset.points, function(point, index){
                        if (point.hasValue()){
                            point.transition({
                                y : this.scale.calculateY(point.value),
                                x : this.scale.calculateX(index)
                            }, easingDecimal);
                        }
                    },this);


                    // Control points need to be calculated in a seperate loop, because we need to know the current x/y of the point
                    // This would cause issues when there is no animation, because the y of the next point would be 0, so beziers would be skewed
                    if (this.options.bezierCurve){
                        Chart.helpers.each(pointsWithValues, function(point, index){
                            var tension = (index > 0 && index < pointsWithValues.length - 1) ? this.options.bezierCurveTension : 0;
                            point.controlPoints = Chart.helpers.splineCurve(
                                previousPoint(point, pointsWithValues, index),
                                point,
                                nextPoint(point, pointsWithValues, index),
                                tension
                            );

                            // Prevent the bezier going outside of the bounds of the graph

                            // Cap puter bezier handles to the upper/lower scale bounds
                            if (point.controlPoints.outer.y > this.scale.endPoint){
                                point.controlPoints.outer.y = this.scale.endPoint;
                            }
                            else if (point.controlPoints.outer.y < this.scale.startPoint){
                                point.controlPoints.outer.y = this.scale.startPoint;
                            }

                            // Cap inner bezier handles to the upper/lower scale bounds
                            if (point.controlPoints.inner.y > this.scale.endPoint){
                                point.controlPoints.inner.y = this.scale.endPoint;
                            }
                            else if (point.controlPoints.inner.y < this.scale.startPoint){
                                point.controlPoints.inner.y = this.scale.startPoint;
                            }
                        },this);
                    }

                    if (this.options.datasetFill && pointsWithValues.length > 0){
                        //Round off the line by going to the base of the chart, back to the start, then fill.
                        ctx.lineTo(pointsWithValues[pointsWithValues.length - 1].x, this.scale.endPoint);
                        ctx.lineTo(pointsWithValues[0].x, this.scale.endPoint);
                        ctx.fillStyle = dataset.fillColor;
                        ctx.closePath();
                        ctx.fill();
                    }

                    //Now draw the points over the line
                    //A little inefficient double looping, but better than the line
                    //lagging behind the point positions
                    Chart.helpers.each(pointsWithValues,function(point){
                        point.draw();
                    });
                },this);
            }
    });
});