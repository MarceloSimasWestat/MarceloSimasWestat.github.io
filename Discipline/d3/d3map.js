$(document).ready(function () {
    var width = 960,
        height = 600,
        center = [width / 2, height / 2],
        defaultFill = "#e0e0e0";

    var projection = d3.geo.albersUsa()
        .scale(1280)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .call(zoom);
    svg.on("wheel.zoom", null);
    svg.on("mousewheel.zoom", null);

    /*svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);*/

    /* svg.append("svg:image")
     .attr("xlink:href", "progress-anim.gif")
     .attr("id", "progress-image")
     .attr("width", 43)
     .attr("height", 11)
     .attr("x", width / 2)
     .attr("y", height / 2);*/

    var g = svg.append("g");

    var tooltip = d3.select("#tooltip")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var CURR_SELECT = ["-2","-1","0","1","2","3","4","5"];

    queue()
        .defer(d3.json, "us.json")
        .defer(d3.json, "medium.json")
        .await(ready);

    function ready(error, us, schoolDistricts) {
        g.append("g")
            .selectAll("path")
            .data(topojson.feature(schoolDistricts, schoolDistricts.objects.medium_G5420_G5400).features)
            .enter().append("path")
            .attr("class", "district")
            .attr("d", path)
            .attr("stroke","#777")
            .attr("stroke-linejoin","round")
            .on("mouseover", function (d) {
                d3.select(this).style("stroke-width", 1 + "px").attr("stroke","blue");
                d3.select(this).classed("selected", true);
                tooltip.transition().duration(100)
                    .style("opacity", 1);
                if (d3.event.pageX > (width - 200)) {
                    tooltip.style("left", (d3.event.pageX - 210) + "px");
                } else {
                    tooltip.style("left", (d3.event.pageX + 20) + "px")
                        .style("top", (d3.event.pageY - 30) + "px");
                }
                if (d3.event.pageY > (height - 150)) {
                    tooltip.style("top", (d3.event.pageY - 140) + "px");
                } else {
                    tooltip.style("top", (d3.event.pageY - 30) + "px");
                }
                tooltip.select(".name").text(d.properties.Name);
                tooltip.select(".totalAbsent").text("Total Absent: " + d.properties["Total Absent"]);
                tooltip.select(".percentAbsent").text("Percent Absent: " + d.properties["Percent Absent"]);
            })
            .on("mouseout", function () {
                d3.select(this).style("stroke-width",.5 + "px").attr("stroke","#777");
                d3.select(this).classed("selected", false);
                tooltip.transition().duration(300)
                    .style("opacity", 0);
            });

        g.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr("class", "state")
            .attr("d", path);

        updateClasses();

        d3.selectAll("#absentGroup li")
            .on("click", function() {
                var item = d3.select(this);
                if (item.classed("selected")) {
                    item.attr("class", "");
                    removeFromArray(CURR_SELECT, item.attr("data-metric"));
                } else {
                    item.classed("selected " + "absentGroup"+item.attr("data-metric"), true);
                    CURR_SELECT.push(item.attr("data-metric"));
                }
                updateClasses();
            });

        d3.selectAll("#selectDistrictType li")
            .on("click", function() {
                d3.select(this).style("background","blue");
            });

        // Zoom buttons
        svg.selectAll(".button")
            .data(['zoom_in', 'zoom_out'])
            .enter()
            .append("g")
            .attr("id", function (d) {
                return d
            })
            .attr("class", "button")
            .attr({x: 20, width: 20, height: 20})
            .append("rect")
            .attr("y", function (d, i) {
                return 20 + 25 * i
            })
            .attr({x: 20, width: 20, height: 20});

        // Plus button
        svg.select("#zoom_in")
            .append("line")
            .attr({x1: 25, y1: 30, x2: 35, y2: 30})
            .attr("stroke", "#fff")
            .attr("stroke-width", "2px");
        svg.select("#zoom_in")
            .append("line")
            .attr({x1: 30, y1: 25, x2: 30, y2: 35})
            .attr("stroke", "#fff")
            .attr("stroke-width", "2px");

        // Minus button
        svg.select("#zoom_out")
            .append("line")
            .attr({x1: 25, y1: 55, x2: 35, y2: 55})
            .attr("stroke", "#fff")
            .attr("stroke-width", "2px");

        svg.selectAll(".button")
            .on("click", function () {
                d3.event.preventDefault();

                var scale = zoom.scale(),
                    extent = zoom.scaleExtent(),
                    translate = zoom.translate(),
                    x = translate[0], y = translate[1],
                    factor = (this.id === 'zoom_in') ? 2 : 1 / 2,
                    target_scale = scale * factor;

                var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
                if (clamped_target_scale != target_scale) {
                    target_scale = clamped_target_scale;
                    factor = target_scale / scale;
                }

                // Center each vector, stretch, then put back
                x = (x - center[0]) * factor + center[0];
                y = (y - center[1]) * factor + center[1];

                // Transition to the new view over 350ms
                d3.transition().duration(350).tween("zoom", function () {
                    var interpolate_scale = d3.interpolate(scale, target_scale),
                        interpolate_trans = d3.interpolate(translate, [x, y]);
                    return function (t) {
                        zoom.scale(interpolate_scale(t))
                            .translate(interpolate_trans(t));
                        svg.call(zoom.event);
                    };
                });
            });
        //svg.select("#progress-image").remove();
    }

    function updateClasses() {
        if (CURR_SELECT.length > 0) {
            svg.selectAll(".district")
                .attr("fill", function(d) { return colorByGroup(d.properties["Absent Group"]) });
        } else {
            svg.selectAll(".district")
                .attr("class", "")
                .attr("fill", defaultFill);
        }
    }

    function colorByGroup(d) {
        if(CURR_SELECT.indexOf(d) != -1) {
            return d == 5 ? '#810f7c' :
                d == 4 ? '#8856a7' :
                    d == 3 ? '#8c96c6' :
                        d == 2 ? '#9ebcda' :
                            d == 1 ? '#bfd3e6' :
                                '#edf8fb';
        }
        else{
            return 'gray';
        }
    }

    function zoomIn() {
        zoom.scale(zoom.scale() * 2);
        move();
    }

    function move() {
        var t = d3.event.translate,
            s = d3.event.scale;
        t[0] = Math.min(width * (s - 1), Math.max(width * (1 - s), t[0]));
        t[1] = Math.min(height * (s - 1), Math.max(height * (1 - s), t[1]));
        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    function clicked(d) {
        var x, y, k;
        var centered;
        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            centered = d;
        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            centered = null;
        }

        g.selectAll("path")
            .classed("active", centered && function (d) {
                    return d === centered;
                });

        g.transition()
            .duration(750)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
    }

    function removeFromArray(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }

    d3.select(self.frameElement).style("height", height + "px");
});