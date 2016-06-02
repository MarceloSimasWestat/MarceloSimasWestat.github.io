// Icon array for chronic absenteeism map (ch 1-1)

function iconArray() {

	// Options accessible to the caller
	// These are the default values

	var	width = 960,
		height = 500,
		animateTime = 2000,
		rowCount = 10,
		iconWidth = 50,
		iconHeight = 50,
		legendWidth = 25,
		legendHeight = 25,
		containerID = [],
		subcontainerID = [],
		chartID = [],
		sectionID = [],
		data = [];

	function chart(selection) {
		selection.each(function() {

			// formats

			var	formatNumber = d3.format(",f"),
				formatPercent = d3.format(",.1%");

			// margins and dimensions

			var margin = {top: 20, right: 20, bottom: 20, left: 20},
				width = 960 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;

			var dom = d3.select(this)
				.append("div")
					.attr("id", chartID)
					.style({
						"max-width": width + "px",
						"margin": "20px auto 20px auto",
						"text-align": "center"
					});

			// first, put in legend

			var legendIcon = dom.append("div")
				.attr("id", "legendIcon")
				.attr("class", "legend")
				.style({
					"display": "inline-block",
					"vertical-align": "middle",
					"height": legendHeight + "px",
					"opacity": 0
				});

			d3.xml("images/chair.svg", "image/svg+xml", function(error, xml) {

				if (error) throw error;

				legendIcon.node().appendChild(xml.documentElement);

				legendIcon.selectAll("svg")
					.attr("height", legendWidth + "px")
					.attr("width", legendHeight + "px");

				legendIcon.selectAll("#Woodchair")
					.attr("class", "icon");

			});

			var legendText = dom.append("div")
				.attr("id", "legendText")
				.attr("class", "legend")
				.style({
					"display": "inline-block",
					"vertical-align": "middle",
					"opacity": 0
				})
				.html("<span>= 100,000 students</span>");

			dom.append("p");

			// next, put in count of chronically absent students

			data_txt = data.filter(function(d) { return d.area == "txt"; });

			var count = dom.append("div")
				.data(data_txt)
				.attr("id", "countSection")
				.style({
					"width": "100%",
					"max-width": width + "px",
					"max-height": "135px",
					"margin": "0 auto",
					"display": "block"
				})
				.append("svg")
					.attr("viewBox", "0 0 " + width + " " + 135)
					.attr("preserveAspectRatio", "xMinYMin meet")
					.style({
						"position": "relative",
						"top": 0,
						"left": 0,
						"width": "100%",
						"height": "100%"
					})
					.append("g")
						.attr("transform", "translate(0,0)");

			// count of chronically absent students

			count.append("text")
				.attr("class", "count")
				.attr("x", (width / 2))
				.attr("dy", 60)
				.attr("text-anchor", "middle")
				.attr("fill-opacity", 0)
				.text(function(d) { return formatNumber(d.number); });

			count.append("text")
				.attr("class", "countText")
				.attr("x", (width / 2))
				.attr("dy", 100)
				.attr("text-anchor", "middle")
				.attr("fill-opacity", 0)
				.text(function(d) { return "students were chronically absent in 2013-14 (" + formatPercent(d.pct) + ")"; });

			// build icon array

			var ia = dom.append("div")
				.attr("id", "iaContainer")
				.style({
					"max-width": (rowCount * iconWidth) + "px",
					"margin": "0 auto",
					"display": "block",
				});

			d3.xml("images/chair.svg", "image/svg+xml", function(xml) {

				var importedNode = document.importNode(xml.documentElement, true);

				data_ia = data.filter(function(d) { return d.area == "ia"; });

				ia.selectAll("div")
					.data(data_ia)
					.enter()
					.append("div")
						.style({
							"display": "inline-block",
						})
						.append("g")
							.each(function() { this.appendChild(importedNode.cloneNode(true)); });

				ia.selectAll("svg")
					.attr("width", iconWidth + "px")
					.attr("height", iconHeight + "px");

				ia.selectAll("#Woodchair")
					.attr("opacity", 0)
					.attr("class", "icon");

			});

			// add equivalency section

			var txt = dom.append("div")
				.data(data_txt)
				.attr("id", "equiSection")
				.style({
					"width": "100%",
					"max-width": width + "px",
					"max-height": "175px",
					"margin": "0 auto",
					"display": "block"
				})
				.append("svg")
					.attr("viewBox", "0 0 " + width + " " + 175)
					.attr("preserveAspectRatio", "xMinYMin meet")
					.style({
						"position": "relative",
						"top": 0,
						"left": 0,
						"width": "100%",
						"height": "100%"
					})
					.append("g")
						.attr("transform", "translate(0,0)");

			txt.append("text")
				.attr("class", "equivText")
				.attr("x", (width / 2))
				.attr("dy", 45)
				.attr("text-anchor", "middle")
				.attr("fill-opacity", 0)
				.text("Cumulatively, across those students, at least");

			txt.append("text")
				.attr("class", "equiv")
				.attr("x", (width / 2))
				.attr("dy", 115)
				.attr("text-anchor", "middle")
				.attr("fill-opacity", 0)
				.text(function(d) { return formatNumber(15 * d.number); });

			txt.append("text")
				.attr("class", "equivText")
				.attr("x", (width / 2))
				.attr("dy", 155)
				.attr("text-anchor", "middle")
				.attr("fill-opacity", 0)
				.text("school days were missed");

			var gs = graphScroll()
				.container(d3.select("#" + containerID))
				.graph(d3.selectAll("#" + chartID))
				.sections(d3.selectAll("#" + subcontainerID + " > div"))
				.on("active", function() {
					if (document.getElementById(sectionID).className == "graph-scroll-active") {

						d3.select("#legendIcon")
							.transition()
								.duration(animateTime)
								.style("opacity", 1);

						d3.select("#legendText")
							.transition()
								.duration(animateTime)
								.style("opacity", 1);

						count.selectAll(".count")
							.transition()
								.duration(animateTime)
								.attr("fill-opacity", 1);

						count.selectAll(".countText")
							.transition()
								.duration(animateTime)
								.attr("fill-opacity", 1);

						ia.selectAll("#Woodchair")
							.transition()
								.delay(function(d, i) { return i * (animateTime/data_ia.length); })
								.duration(animateTime)
								.attr("opacity", 1);

						txt.selectAll(".equivText")
							.transition()
								.delay(animateTime)
								.duration(animateTime)
								.attr("fill-opacity", 1);

						txt.selectAll(".equiv")
							.transition()
								.delay(animateTime)
								.duration(animateTime)
								.attr("fill-opacity", 1);

				}});

		});

	};

    chart.width = function(value) {

        if (!arguments.length) return width;
        width = value;
        return chart;

    };

    chart.height = function(value) {

        if (!arguments.length) return height;
        height = value;
        return chart;

    };

	chart.animateTime = function(value) {

		if (!arguments.length) return animateTime;
		animateTime = value;
		return chart;

	};

	chart.rowCount = function(value) {

		if (!arguments.length) return rowCount;
		rowCount = value;
		return chart;

	};

	chart.iconWidth = function(value) {

		if (!arguments.length) return iconWidth;
		iconWidth = value;
		return chart;

	};

	chart.iconHeight = function(value) {

		if (!arguments.length) return iconHeight;
		iconHeight = value;
		return chart;

	};

	chart.legendWidth = function(value) {

		if (!arguments.length) return legendWidth;
		legendWidth = value;
		return chart;

	};

	chart.legendHeight = function(value) {

		if (!arguments.length) return legendHeight;
		legendHeight = value;
		return chart;

	};

	chart.containerID = function(value) {

		if (!arguments.length) return containerID;
		containerID = value;
		return chart;

	};

	chart.chartID = function(value) {

		if (!arguments.length) return chartID;
		chartID = value;
		return chart;

	};

	chart.subcontainerID = function(value) {

		if (!arguments.length) return subcontainerID;
		subcontainerID = value;
		return chart;

	};

	chart.sectionID = function(value) {

		if (!arguments.length) return sectionID;
		sectionID = value;
		return chart;

	};

    chart.data = function(value) {

        if (!arguments.length) return data;
        data = value;
        return chart;

    };

	return chart;

};

// Reusable bar chart function for chronic absenteeism storymap

function barChart() {

	// Options accessible to the caller
	// These are the default values

	var	width = [],
		height = 500,
		marginTop = 40,
		marginLeft = 100,
		marginBottom = 40,
		barWidth = 15,
		animateTime = 1000,
		title = "Generic chart title. Update me using .title()!",
		containerID = [],
		subcontainerID = [],
		chartID = [],
		sectionID = [],
		data = [];

	function chart(selection) {
		selection.each(function() {

		// formats

		var	formatNumber = d3.format(",f"),
			formatPercent = d3.format(",.1%");

		// margins; adjust width and height to account for margins

		width = parseInt(d3.select("#" + sectionID).style("width"), 10);
		
		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// selections

		var dom = d3.select(this)
			.append("div")
			.attr("id", chartID)
			.attr("width", width);
				/*.style({
					"max-width": width + "px",
					"margin": "0 auto"
				})
				.append("div")
					.style({
						"width": "100%",
						"max-width": width + "px",
						"height": 0,
						"max-height": height + "px",
						"padding-top": (100*(height/width)) + "%",
						"position": "relative",
						"margin": "0 auto"
					});*/

		var svg = dom.append("svg")
			.attr("class", "bar-chart")
			/*.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.style({
				"max-width": width,
				"max-height": height,
				"position": "absolute",
				"top": 0,
				"left": 0,
				"width": "100%",
				"height": "100%"
			})*/
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

		// tooltips using d3-tip

		var tipBar = d3.tip()
			.attr("class", "d3-tip-bar")
			.direction("e")
			.offset([0, 10])
			.html(function(d) {

			return formatPercent(d.var3) + " (" + formatNumber(d.var2) + " students)";


		});

		svg.call(tipBar);

		// axis scales

		var xScale = d3.scale.linear().range([0, widthAdj]),
			yScale = d3.scale.ordinal().range([heightAdj, 0]).rangeRoundBands([0, heightAdj], 0.5);

		// domains

		xScale.domain([0, d3.max(data, function(d) { return d.var3; })]).nice();
		yScale.domain(data.map(function(d, i) { return d.var1; }));

		// axes

		function formatValueAxis(d) {

			var TickValue = formatNumber(d * 100);

			return TickValue;

		};

		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatValueAxis).tickSize(-1 * heightAdj).ticks(Math.max(widthAdj/50, 2)),
			yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0);

		// draw x-axis below bars

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.call(xAxis)

		svg.append("text")
			.attr("class", "x axis")
			.attr("x", widthAdj)
			.attr("dx", "0.5em")
			.attr("y", heightAdj)
			.attr("dy", "3.1em")
			.attr("text-anchor", "end")
			.text("% CHRONICALLY ABSENT IN 2013-14")

		// draw bars

		var bars = svg.selectAll("rect.bar")
			.data(data);

		bars.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("rect")
					.attr("class","bar")
					.attr("x", 0)
					.attr("width", 0)
					.attr("y", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2) - (barWidth/2); })
					.attr("height", barWidth)
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide);

		var gs = graphScroll()
			.container(d3.select("#" + containerID))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#" + subcontainerID + " > div"))
			.on("active", function() {
				if (document.getElementById(sectionID).className == "graph-scroll-active") {

					svg.selectAll("rect.bar")
						.transition()
						.duration(animateTime)
						.attr("width", function(d) { return xScale(d.var3); });

			}});

		// draw y-axis above bars

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)

		// chart title

		svg.append("text")
			.attr("class", "title")
			.attr("x", 0 - marginLeft)
			.attr("y", 0 - marginTop)
			.attr("dy", "1em")
			.attr("text-anchor", "start")
			.text(title);

		// resize	
			
		window.addEventListener("resize", function() {
			
			// update width
			
			width = parseInt(d3.select("#" + sectionID).style("width"), 10);
			widthAdj = width - marginLeft - margin.right;
			
			// resize chart
						
			xScale.range([0, widthAdj]);
			xAxis.ticks(Math.max(widthAdj/50, 2));
			
			/*d3.select("#" + chartID)
				.attr("width", width);*/
			
			dom.selectAll(".bar-chart")
				.attr("width", width);
			
			dom.select(".x.axis")
				.call(xAxis);
			
			dom.select("text.x.axis")
				.attr("x", widthAdj)
				.attr("dx", "0.5em");
				
			dom.selectAll("rect.bar")
				.attr("width", 0);

			var gs2 = graphScroll()
			.container(d3.select("#" + containerID))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#" + subcontainerID + " > div"))
			.on("active", function() {
				if (document.getElementById(chartID).className == "graph-scroll-fixed" || document.getElementById(chartID).className == "graph-scroll-below") {

					svg.selectAll("rect.bar")
						.transition()
						.duration(animateTime)
						.attr("width", function(d) { return xScale(d.var3); });

			}});			
				
		});
		
		});

	};

    /* chart.width = function(value) {

        if (!arguments.length) return width;
        width = value;
        return chart;

    }; */

    chart.height = function(value) {

        if (!arguments.length) return height;
        height = value;
        return chart;

    };

	chart.marginTop = function(value) {

		if (!arguments.length) return marginTop;
		marginTop = value;
		return chart;

	};

	chart.marginLeft = function(value) {

		if (!arguments.length) return marginLeft;
		marginLeft = value;
		return chart;

	};

	chart.marginBottom = function(value) {

		if (!arguments.length) return marginBottom;
		marginBottom = value;
		return chart;

	};

	chart.animateTime = function(value) {

		if (!arguments.length) return animateTime;
		animateTime = value;
		return chart;

	};

	chart.barWidth = function(value) {

		if (!arguments.length) return barWidth;
		barWidth = value;
		return chart;

	};

	chart.title = function(value) {

		if (!arguments.length) return title;
		title = value;
		return chart;

	};

	chart.containerID = function(value) {

		if (!arguments.length) return containerID;
		containerID = value;
		return chart;

	};

	chart.chartID = function(value) {

		if (!arguments.length) return chartID;
		chartID = value;
		return chart;

	};

	chart.subcontainerID = function(value) {

		if (!arguments.length) return subcontainerID;
		subcontainerID = value;
		return chart;

	};

	chart.sectionID = function(value) {

		if (!arguments.length) return sectionID;
		sectionID = value;
		width = parseInt(d3.select("#" + sectionID).style("width"), 10);
		return chart;

	};

    chart.data = function(value) {

        if (!arguments.length) return data;
        data = value;
        return chart;

    };

	return chart;
		
};

// Reusable bar chart function for chronic absenteeism storymap

function colChart() {

	// Options accessible to the caller
	// These are the default values

	var	width = [],
		height = 500,
		marginTop = 60,
		marginLeft = 20,
		marginBottom = 20,
		animateTime = 1000,
		colWidth = 15,
		title = "Generic chart title. Update me using .title()!",
		containerID = [],
		subcontainerID = [],
		chartID = [],
		sectionID = [],
		data = [];

	function chart(selection) {
		selection.each(function() {

		// formats

		var	formatNumber = d3.format(",f"),
			formatPercent = d3.format(",.1%");

		// margins; adjust width and height to account for margins

		width = parseInt(d3.select("#" + sectionID).style("width"), 10);
		
		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// selections

		var dom = d3.select(this)
			.append("div")
			.attr("id", chartID)
				/*.style({
					"max-width": width + "px",
					"margin": "0 auto"
				})
				.append("div")
					.style({
						"width": "100%",
						"max-width": width + "px",
						"height": 0,
						"padding-top": (100*(height/width)) + "%",
						"position": "relative",
						"margin": "0 auto"
					});*/

		var svg = dom.append("svg")
			.attr("class", "col-chart")
			/*.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.style({
				"max-width": width,
				"position": "absolute",
				"top": 0,
				"left": 0,
				"width": "100%",
				"height": "100%"
			})*/
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

		// tooltips using d3-tip

		var tipCol = d3.tip()
			.attr("class", "d3-tip-col")
			.offset([-10, 0])
			.html(function(d) {

			return formatPercent(d.var3) + " (" + formatNumber(d.var2) + " students)";


		});

		svg.call(tipCol);

		// axis scales

		var xScale = d3.scale.ordinal().rangeRoundBands([0, widthAdj], .5),
			yScale = d3.scale.linear().range([heightAdj, 0]);

		// domains

		xScale.domain(data.map(function(d, i) { return d.var1; }));
		yScale.domain([0, d3.max(data, function(d) { return d.var3; })]).nice();

		// axes

		function formatValueAxis(d) {

			var TickValue = formatNumber(d * 100);

			return TickValue;

		};

		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0),
			yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(formatValueAxis).tickSize(-1 * widthAdj);

		// draw y-axis under columns

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.selectAll("text")

		svg.append("text")
			.attr("class", "y axis")
			.attr("x", -15)
			.attr("y", "-2.1em")
			.attr("text-anchor", "start")
			.text("% CHRONICALLY ABSENT IN 2013-14");

		// draw columns

		var cols = svg.selectAll("rect.column")
			.data(data);

		cols.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("rect")
					.attr("class","column")
					.attr("x", function(d, i) { return xScale(d.var1) + (xScale.rangeBand() / 2) - (colWidth / 2); })
					.attr("width", colWidth)
					.attr("y", heightAdj)
					.attr("height", 0)
					.on("mouseover", tipCol.show)
					.on("mouseout", tipCol.hide);

		var gs = graphScroll()
			.container(d3.select("#" + containerID))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#" + subcontainerID + " > div"))
			.on("active", function() {
				if (document.getElementById(sectionID).className == "graph-scroll-active") {

					svg.selectAll("rect.column")
						.transition()
							.duration(animateTime)
							.attr("height", function(d) { return heightAdj - yScale(d.var3); })
							.attr("y", function(d) { return yScale(d.var3); });

			}});

		// draw x-axis above columns

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.call(xAxis)
			.selectAll(".tick text")
				.call(wrap, xScale.rangeBand());

		// chart title

		svg.append("text")
			.attr("class", "title")
			.attr("x", 0 - marginLeft)
			.attr("y", 0 - marginTop)
			.attr("dy", "1em")
			.attr("text-anchor", "start")
			.text(title);

		// resize	
			
		window.addEventListener("resize", function() {
			
			// update width
			
			width = parseInt(d3.select("#" + sectionID).style("width"), 10);
			widthAdj = width - marginLeft - margin.right;
			
			// resize chart
						
			xScale.rangeRoundBands([0, widthAdj], .5);
			yAxis.tickSize(-1 * widthAdj);
			
			dom.selectAll(".col-chart")
				.attr("width", width);
			
			dom.select(".x.axis")
				.call(xAxis);
				
			dom.select(".y.axis")
				.call(yAxis);
							
			dom.selectAll("rect.column")
				.attr("x", function(d, i) { return xScale(d.var1) + (xScale.rangeBand() / 2) - (colWidth / 2); })
				.attr("height", 0)
				.attr("y", heightAdj);

			var gs2 = graphScroll()
				.container(d3.select("#" + containerID))
				.graph(d3.selectAll("#" + chartID))
				.sections(d3.selectAll("#" + subcontainerID + " > div"))
				.on("active", function() {
					if (document.getElementById(chartID).className == "graph-scroll-fixed" || document.getElementById(chartID).className == "graph-scroll-below") {

						svg.selectAll("rect.column")
							.transition()
								.duration(animateTime)
								.attr("height", function(d) { return heightAdj - yScale(d.var3); })
								.attr("y", function(d) { return yScale(d.var3); });

				}});				
				
		});			
			
		});

	};

    /* chart.width = function(value) {

        if (!arguments.length) return width;
        width = value;
        return chart;

    }; */

    chart.height = function(value) {

        if (!arguments.length) return height;
        height = value;
        return chart;

    };

	chart.marginTop = function(value) {

		if (!arguments.length) return marginTop;
		marginTop = value;
		return chart;

	};

	chart.marginLeft = function(value) {

		if (!arguments.length) return marginLeft;
		marginLeft = value;
		return chart;

	};

	chart.marginBottom = function(value) {

		if (!arguments.length) return marginBottom;
		marginBottom = value;
		return chart;

	};

	chart.animateTime = function(value) {

		if (!arguments.length) return animateTime;
		animateTime = value;
		return chart;

	};

	chart.colWidth = function(value) {

		if (!arguments.length) return colWidth;
		colWidth = value;
		return chart;

	};
	chart.title = function(value) {

		if (!arguments.length) return title;
		title = value;
		return chart;

	};

	chart.containerID = function(value) {

		if (!arguments.length) return containerID;
		containerID = value;
		return chart;

	};

	chart.chartID = function(value) {

		if (!arguments.length) return chartID;
		chartID = value;
		return chart;

	};

	chart.subcontainerID = function(value) {

		if (!arguments.length) return subcontainerID;
		subcontainerID = value;
		return chart;

	};

	chart.sectionID = function(value) {

		if (!arguments.length) return sectionID;
		sectionID = value;
		return chart;

	};

    chart.data = function(value) {

        if (!arguments.length) return data;
        data = value;
        return chart;

    };

	return chart;

};

// Reusable dot plot function for chronic absenteeism story map

function dotPlot() {

	// Options accessible to the caller
	// These are the default values

	var	width = [],
		height = 500,
		marginTop = 40,
		marginLeft = 100,
		marginBottom = 40,
		dotSize = 25,
		animateTime = 1000,
		title = "Generic chart title. Update me using .title()!",
		clipName = [],
		containerID = [],
		subcontainerID = [],
		chartID = [],
		sectionID = [],
		data = [];

	function chart(selection) {
		selection.each(function() {

		// formats

		var	formatNumber = d3.format(",f"),
			formatPercent = d3.format(",.1%");

		// margins; adjust width and height to account for margins

		width = parseInt(d3.select("#" + sectionID).style("width"), 10);
		
		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// selections

		var dom = d3.select(this)
			.append("div")
			.attr("id", chartID);
			/*	.style({
					"max-width": width + "px",
					"margin": "0 auto"
				})
				.append("div")
					.style({
						"width": "100%",
						"max-width": width + "px",
						"height": 0,
						"padding-top": (100*(height/width)) + "%",
						"position": "relative",
						"margin": "0 auto"
					});*/

		var svg = dom.append("svg")
			.attr("class", "dotPlot")
			/*.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.style({
				"max-width": width,
				"position": "absolute",
				"top": 0,
				"left": 0,
				"width": "100%",
				"height": "100%"
			})*/
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

		// tooltips using d3-tip

		var tipDot = d3.tip()
			.attr("class", "d3-tip-dot")
			.direction("e")
			.offset([0, 10])
			.html(function(d) {

			return formatPercent(d.var3) + " (" + formatNumber(d.var2) + " students)";


		});

		svg.call(tipDot);

		// axis scales and axes

		var xScale = d3.scale.linear().range([0, widthAdj]),
			yScale = d3.scale.ordinal().rangeRoundBands([0, heightAdj], .1);

		// domains

		xScale.domain([0, d3.max(data, function(d) { return d.var3; })]).nice();
		yScale.domain(data.map(function(d, i) { return d.var1; }));

		// axes

		function formatValueAxis(d) {

			var TickValue = formatNumber(d * 100);

			return TickValue;

		};

		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatValueAxis).tickSize(-1 * heightAdj).ticks(Math.max(widthAdj/50, 2)),
			yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0);

		// draw x-axis below bars

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.call(xAxis)

		svg.append("text")
			.attr("class", "x axis")
			.attr("x", widthAdj)
			.attr("dx", "0.5em")
			.attr("y", heightAdj)
			.attr("dy", "2em")
			.attr("text-anchor", "end")
			.text("Test 1");

		// draw dots and lines

		var lines = svg.selectAll("line.dotLine")
			.data(data);

		lines.enter()
			.append("g")
			.attr("transform", "translate(0,0)")
			.append("line")
				.attr("class", "dotLine")
				.attr("x1", 0)
				.attr("x2", 0)
				.attr("y1", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
				.attr("y2", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); });

		var dots = svg.selectAll("circle.dot")
			.data(data);

		dots.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("circle")
					.attr("class", "dot")
					.attr("clip-path", function() { return "url(#clip)" + clipName + ")"; })
					.attr("cx", 0)
					.attr("cy", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
					.attr("r", 5)
					.on("mouseover", tipDot.show)
					.on("mouseout", tipDot.hide);

		var gs = graphScroll()
			.container(d3.select("#" + containerID))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#" + subcontainerID + " > div"))
			.on("active", function() {
				if (document.getElementById(sectionID).className == "graph-scroll-active") {

					svg.selectAll("line.dotLine")
						.transition()
							.duration(animateTime)
							.attr("x2", function(d) { return xScale(d.var3); })
							.each("end", function(d) {
								d3.select(this)
									.transition()
										.duration(animateTime)
										.attr("x2", function(d) { return xScale(d.var3) - dotSize; });
							});

					svg.selectAll("circle.dot")
						.transition()
							.duration(animateTime)
							.attr("cx", function(d) { return xScale(d.var3); })
							.each("end", function(d) {
								d3.select(this)
									.transition()
										.duration(animateTime)
										.attr("r", dotSize);
							});

			}});

		// add clip path

		svg.append("defs")
			.append("clipPath")
				.attr("id", function() { return "clip" + clipName; })
					.append("rect")
						.attr("width", widthAdj + margin.right)
						.attr("height", heightAdj);

		// draw y-axis above

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)

		// chart title

		svg.append("text")
			.attr("class", "title")
			.attr("x", 0 - marginLeft)
			.attr("y", 0 - marginTop)
			.attr("dy", "1em")
			.attr("text-anchor", "start")
			.text(title);

		// resize	
			
		window.addEventListener("resize", function() {
			
			// update width
			
			width = parseInt(d3.select("#" + sectionID).style("width"), 10);
			widthAdj = width - marginLeft - margin.right;
			
			// resize chart
						
			xScale.range([0, widthAdj]);
			xAxis.ticks(Math.max(widthAdj/50, 2));
			
			/*d3.select("#" + chartID)
				.attr("width", width);*/
			
			dom.selectAll(".dotPlot")
				.attr("width", width);
			
			dom.select(".x.axis")
				.call(xAxis);
			
			dom.select("text.x.axis")
				.attr("x", widthAdj)
				.attr("dx", "0.5em");
				
			dom.selectAll(".dotLine")
				.attr("x2", 0);
				
			dom.selectAll(".dot")
				.attr("cx", 0)
				.attr("r", 5);
								
			var gs2 = graphScroll()
				.container(d3.select("#" + containerID))
				.graph(d3.selectAll("#" + chartID))
				.sections(d3.selectAll("#" + subcontainerID + " > div"))
				.on("active", function() {
					if (document.getElementById(chartID).className == "graph-scroll-fixed" || document.getElementById(chartID).className == "graph-scroll-below") {

						svg.selectAll("line.dotLine")
							.transition()
								.duration(animateTime)
								.attr("x2", function(d) { return xScale(d.var3); })
								.each("end", function(d) {
									d3.select(this)
										.transition()
											.duration(animateTime)
											.attr("x2", function(d) { return xScale(d.var3) - dotSize; });
								});

						svg.selectAll("circle.dot")
							.transition()
								.duration(animateTime)
								.attr("cx", function(d) { return xScale(d.var3); })
								.each("end", function(d) {
									d3.select(this)
										.transition()
											.duration(animateTime)
											.attr("r", dotSize);
								});

				}});

		});			
			
		});

	};

   /* chart.width = function(value) {

        if (!arguments.length) return width;
        width = value;
        return chart;

    }; */

    chart.height = function(value) {

        if (!arguments.length) return height;
        height = value;
        return chart;

    };

	chart.marginTop = function(value) {

		if (!arguments.length) return marginTop;
		marginTop = value;
		return chart;

	};

	chart.marginLeft = function(value) {

		if (!arguments.length) return marginLeft;
		marginLeft = value;
		return chart;

	};

	chart.marginBottom = function(value) {

		if (!arguments.length) return marginBottom;
		marginBottom = value;
		return chart;

	};

	chart.dotSize = function(value) {

		if (!arguments.length) return dotSize;
		dotSize = value;
		return chart;

	};

	chart.animateTime = function(value) {

		if (!arguments.length) return animateTime;
		animateTime = value;
		return chart;

	};

	chart.title = function(value) {

		if (!arguments.length) return title;
		title = value;
		return chart;

	};

	chart.clipName = function(value) {

		if (!arguments.length) return clipName;
		clipName = value;
		return chart;

	};

	chart.containerID = function(value) {

		if (!arguments.length) return containerID;
		containerID = value;
		return chart;

	};

	chart.subcontainerID = function(value) {

		if (!arguments.length) return subcontainerID;
		subcontainerID = value;
		return chart;

	};

	chart.chartID = function(value) {

		if (!arguments.length) return chartID;
		chartID = value;
		return chart;

	};

	chart.sectionID = function(value) {

		if (!arguments.length) return sectionID;
		sectionID = value;
		return chart;

	};

    chart.data = function(value) {

        if (!arguments.length) return data;
        data = value;
        return chart;

    };

	return chart;

};

// Dot plot with filters for chronic absenteeism story map

function dotPlotFilter() {

	// Options accessible to the caller
	// These are the default values

	var	width = [],
		height = 650,
		marginTop = 40,
		marginLeft = 100,
		marginBottom = 80,
		animateTime = 1000,
		dotSize = 25,
		title1 = "Generic chart title #1. Update me using .title1()!",
		title2 = "Generic chart title #2. Update me using .title2()!",
		title3 = "Generic chart title #3. Update me using .title3()!",
		title4 = "Generic chart title #4. Update me using .title4()!",
		buttonsID = [],
		clipName = [],
		containerID = [],
		subcontainerID = [],
		sectionID = [],
		chartID = [],
		data = [];

	var updateTitle,
		updateData;

	function chart(selection) {
		selection.each(function() {

		// filter data for default to show r/e categories

		var subChartID = 1;

		dataFiltered = data.filter(function(d) { return d.subchart == subChartID; });

		// formats

		var	formatNumber = d3.format(",f"),
			formatPercent = d3.format(",.1%");

		// margins; adjust width and height to account for margins

		width = parseInt(d3.select("#" + sectionID).style("width"), 10);
		
		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// buttons for filtering

		var buttons = d3.select(this)
			.append("div")
			.attr("id", chartID)
				.style({
					"max-width": width + "px",
					"margin": "0 auto"
				})
				.attr("id", buttonsID)
				.attr("class", "filters");

		d3.select("#" + buttonsID)
			.append("button")
			.attr("class", "filterButton")
			.text("Small")
			.on("click", function() {

				updateData(1);
				updateTitle(1);

			});

		d3.select("#" + buttonsID)
			.append("button")
			.attr("class", "filterButton")
			.text("Medium-small")
			.on("click", function() {

				updateData(2);
				updateTitle(2);

			});

		d3.select("#" + buttonsID)
			.append("button")
			.attr("class", "filterButton")
			.text("Medium-large")
			.on("click", function() {

				updateData(3);
				updateTitle(3);

			});

		d3.select("#" + buttonsID)
			.append("button")
			.attr("class", "filterButton")
			.text("Large")
			.on("click", function() {

				updateData(4);
				updateTitle(4);

			});

		d3.select("#" + buttonsID)
			.append("p");

		// selections

		var dom = d3.select(this)
			.append("div")
			.attr("id", chartID);
			/*	.style({
					"max-width": width + "px",
					"margin": "0 auto"
				})
				.append("div")
					.style({
						"width": "100%",
						"max-width": width + "px",
						"height": 0,
						"max-height": height + "px",
						"padding-top": (100*(height/width)) + "%",
						"position": "relative",
						"margin": "0 auto"
					});*/

		var svg = dom.append("svg")
			.attr("class", "dotPlot")
			/*.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.style({
				"max-width": width,
				"max-height": height,
				"position": "absolute",
				"top": 0,
				"left": 0,
				"width": "100%",
				"height": "100%"
			})*/
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

		// tooltips using d3-tip

		var tipDot = d3.tip()
			.attr("class", "d3-tip-dot")
			.direction("e")
			.offset([0, 10])
			.html(function(d) {

			return formatPercent(d.var3) + " (" + formatNumber(d.var2) + " students)";

		});

		svg.call(tipDot);

		// axis scales

		var xScale = d3.scale.linear().range([0, widthAdj]),
			yScale = d3.scale.ordinal().rangeRoundBands([0, heightAdj], 0.1);

		// domains

		xScale.domain([0, d3.max(data, function(d) { return d.var3; })]).nice();
		yScale.domain(dataFiltered.map(function(d) { return d.var1; }));

		// axes

		function formatValueAxis(d) {

			var TickValue = formatNumber(d * 100);

			return TickValue;

		};

		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatValueAxis).tickSize(-1 * heightAdj).ticks(Math.max(widthAdj/50, 2)),
			yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0);

		// draw x-axis below bars

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.call(xAxis)

		svg.append("text")
			.attr("class", "x axis")
			.attr("x", widthAdj)
			.attr("dx", "0.5em")
			.attr("y", heightAdj)
			.attr("dy", "2em")
			.attr("text-anchor", "end")
			.text("Test 2");

		// draw dots and lines

		var lines = svg.selectAll("line.dotLine")
			.data(dataFiltered);

		lines.enter()
			.append("g")
			.attr("transform", "translate(0,0)")
			.append("line")
				.attr("class", "dotLine")
				.attr("x1", 0)
				.attr("x2", 0)
				.attr("y1", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
				.attr("y2", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); });

		var dots = svg.selectAll("circle.dot")
			.data(dataFiltered);

		dots.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("circle")
					.attr("class", "dot")
					.attr("clip-path", function() { return "url(#clip)" + clipName + ")"; })
					.attr("cx", 0)
					.attr("cy", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
					.attr("r", 5)
					.on("mouseover", tipDot.show)
					.on("mouseout", tipDot.hide);

		var gs = graphScroll()
			.container(d3.select("#" + containerID))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#" + subcontainerID + " > div"))
			.on("active", function() {
				if (document.getElementById(sectionID).className == "graph-scroll-active") {

					svg.selectAll("line.dotLine")
						.transition()
							.duration(animateTime)
							.attr("x2", function(d) { return xScale(d.var3); })
							.each("end", function(d) {
								d3.select(this)
									.transition()
										.duration(animateTime)
										.attr("x2", function(d) { return xScale(d.var3) - dotSize; });
							});

					svg.selectAll("circle.dot")
						.transition()
							.duration(animateTime)
							.attr("cx", function(d) { return xScale(d.var3); })
							.each("end", function(d) {
								d3.select(this)
									.transition()
										.duration(animateTime)
										.attr("r", dotSize);
							});

			}});

		// add clip path

		svg.append("defs")
			.append("clipPath")
				.attr("id", function() { return "clip" + clipName; })
					.append("rect")
						.attr("width", widthAdj + margin.right)
						.attr("height", heightAdj);

		// draw y-axis above bars

		svg.append("g")
			.attr("class", "y axis")
			.style("opacity", 0)
			.call(yAxis)
			.transition()
				.duration(animateTime)
				.style("opacity", 1);

		// chart title (default to title1)

		svg.append("text")
			.attr("class", "title")
			.attr("x", 0 - marginLeft)
			.attr("y", 0 - marginTop)
			.attr("dy", "1em")
			.attr("text-anchor", "start")
			.attr("fill-opacity", 0)
			.text(title1)
			.transition()
				.duration(animateTime)
				.attr("fill-opacity", 1);

		// update functions

		function updateTitle(titleID) {

			svg.select(".title").remove();

			svg.append("text")
				.attr("class", "title")
				.attr("x", 0 - marginLeft)
				.attr("y", 0 - marginTop)
				.attr("dy", "1em")
				.attr("text-anchor", "start")
				.attr("fill-opacity", 0)
				.text(function() {
					if (titleID == 1) { return title1; }
					if (titleID == 2) { return title2; }
					if (titleID == 3) { return title3; }
					if (titleID == 4) { return title4; }
				})
				.transition()
					.duration(animateTime)
					.attr("fill-opacity", 1);

		};

		function updateData(subChartID) {

			// re-filter data

			dataFiltered = data.filter(function(d) { return d.subchart == subChartID; });

			// update scales

			xScale.domain([0, d3.max(data, function(d) { return d.var3; })]).nice();
			yScale.domain(dataFiltered.map(function(d) { return d.var1; }));

			// update dots and lines

			var updateLines = svg.selectAll("line.dotLine")
				.data(dataFiltered);

			updateLines.transition()
				.duration(animateTime)
				.attr("x2", function(d) { return xScale(d.var3) - dotSize; });

			var updateDots = svg.selectAll("circle.dot")
				.data(dataFiltered);

			updateDots.transition()
				.duration(animateTime)
				.attr("cx", function(d) { return xScale(d.var3); });

			};

				// resize	
			
		window.addEventListener("resize", function() {
			
			// update width
			
			width = parseInt(d3.select("#" + sectionID).style("width"), 10);
			widthAdj = width - marginLeft - margin.right;
			
			// resize chart
						
			xScale.range([0, widthAdj])
			xAxis.ticks(Math.max(widthAdj/50, 2));
			
			/*d3.select("#" + chartID)
				.attr("width", width);*/
			
			dom.selectAll(".dotPlot")
				.attr("width", width);
			
			dom.select(".x.axis")
				.call(xAxis);
			
			dom.select("text.x.axis")
				.attr("x", widthAdj)
				.attr("dx", "0.5em");
				
			dom.selectAll(".dotLine")
				.attr("x2", 0);
				
			dom.selectAll(".dot")
				.attr("cx", 0)
				.attr("r", 5);

			var gs2 = graphScroll()
				.container(d3.select("#" + containerID))
				.graph(d3.selectAll("#" + chartID))
				.sections(d3.selectAll("#" + subcontainerID + " > div"))
				.on("active", function() {
					if (document.getElementById(chartID).className == "graph-scroll-fixed" || document.getElementById(chartID).className == "graph-scroll-below") {

						svg.selectAll("line.dotLine")
							.transition()
								.duration(animateTime)
								.attr("x2", function(d) { return xScale(d.var3); })
								.each("end", function(d) {
									d3.select(this)
										.transition()
											.duration(animateTime)
											.attr("x2", function(d) { return xScale(d.var3) - dotSize; });
								});

						svg.selectAll("circle.dot")
							.transition()
								.duration(animateTime)
								.attr("cx", function(d) { return xScale(d.var3); })
								.each("end", function(d) {
									d3.select(this)
										.transition()
											.duration(animateTime)
											.attr("r", dotSize);
								});

				}});
				
			dom.select("clipPath")
				.select("rect")
				.attr("width", widthAdj);
			
		});			
			
		});

	};

   /* chart.width = function(value) {

        if (!arguments.length) return width;
        width = value;
        return chart;

    }; */

    chart.height = function(value) {

        if (!arguments.length) return height;
        height = value;
        return chart;

    };

	chart.marginTop = function(value) {

		if (!arguments.length) return marginTop;
		marginTop = value;
		return chart;

	};

	chart.marginLeft = function(value) {

		if (!arguments.length) return marginLeft;
		marginLeft = value;
		return chart;

	};

	chart.marginBottom = function(value) {

		if (!arguments.length) return marginBottom;
		marginBottom = value;
		return chart;

	};

	chart.animateTime = function(value) {

		if (!arguments.length) return animateTime;
		animateTime = value;
		return chart;

	};

	chart.dotSize = function(value) {

		if (!arguments.length) return dotSize;
		dotSize = value;
		return chart;

	};

	chart.buttonsID = function(value) {

		if (!arguments.length) return buttonsID;
		buttonsID = value;
		return chart;

	};

	chart.clipName = function(value) {

		if (!arguments.length) return clipName;
		clipName = value;
		return chart;

	};

	chart.title1 = function(value) {

		if (!arguments.length) return title1;
		title1 = value;
		return chart;

	};

	chart.title2 = function(value) {

		if (!arguments.length) return title2;
		title2 = value;
		return chart;

	};

	chart.title3 = function(value) {

		if (!arguments.length) return title3;
		title3 = value;
		return chart;

	};

	chart.title4 = function(value) {

		if (!arguments.length) return title4;
		title4 = value;
		return chart;

	};

	chart.containerID = function(value) {

		if (!arguments.length) return containerID;
		containerID = value;
		return chart;

	};

	chart.subcontainerID = function(value) {

		if (!arguments.length) return subcontainerID;
		subcontainerID = value;
		return chart;

	};

	chart.sectionID = function(value) {

		if (!arguments.length) return sectionID;
		sectionID = value;
		return chart;

	};

	chart.chartID = function(value) {

		if (!arguments.length) return chartID;
		chartID = value;
		return chart;

	};

    chart.data = function(value) {

        if (!arguments.length) return data;
        data = value;
        if (typeof updateData === 'function') updateData();
        return chart;

    };

	return chart;

};

// Grouped bar chart function for chronic absenteeism storymap

function groupedBar() {

	// Options accessible to the caller
	// These are the default values

	var	width = [],
		height = 650,
		marginTop = 40,
		marginLeft = 100,
		marginBottom = 40,
		animateTime = 1000,
		barWidth = 15,
		title1 = "Generic chart title #1. Update me using .title1()!",
		title2 = "Generic chart title #2. Update me using .title2()!",
		title3 = "Generic chart title #3. Update me using .title3()!",
		title4 = "Generic chart title #4. Update me using .title4()!",
		buttonsID = [],
		containerID = [],
		subcontainerID = [],
		chartID = [],
		sectionID = [],
		data = [];

	var updateTitle,
		updateData;

	function chart(selection) {
		selection.each(function() {

		// filter data for default to show r/e categories

		var subChartID = 1;

		dataFiltered = data.filter(function(d) { return d.subchart == subChartID; });

		// formats

		var	formatNumber = d3.format(",f"),
			formatPercent = d3.format(",.1%");

		// margins; adjust width and height to account for margins
		
		width = parseInt(d3.select("#" + sectionID).style("width"), 10);

		var margin = {right: 20},
			heightAdj = height - marginTop - marginBottom;
			
		var widthAdj = ((width - marginLeft - margin.right) <= 100) ? (width - marginLeft - margin.right + 100) : (width - marginLeft - margin.right);

		// buttons for filtering

		var buttons = d3.select(this)
			.append("div")
			.style({
					"max-width": width + "px",
					"margin": "0 auto"
				})
				.attr("id", buttonsID)
				.attr("class", "filters")

		d3.select("#" + buttonsID)
			.append("button")
			.attr("class", "filterButton")
			.text("Race & Ethnicity")
			.on("click", function() {

				updateData(1);
				updateTitle(1);

			});

		d3.select("#" + buttonsID)
			.append("button")
			.attr("class", "filterButton")
			.text("Gender")
			.on("click", function() {

				updateData(2);
				updateTitle(2);

			});

		d3.select("#" + buttonsID)
			.append("button")
			.attr("class", "filterButton")
			.text("With Disability")
			.on("click", function() {

				updateData(3);
				updateTitle(3);

			});

		d3.select("#" + buttonsID)
			.append("button")
			.attr("class", "filterButton")
			.text("English Language Learner")
			.on("click", function() {

				updateData(4);
				updateTitle(4);

			});

		d3.select("#" + buttonsID)
			.append("p");

		// selections

		var dom = d3.select(this)
			.append("div")
			.attr("id", chartID);
			/*	.style({
					"max-width": width + "px",
					"margin": "0 auto"
				})
				.append("div")
					.style({
						"width": "100%",
						"max-width": width + "px",
						"height": 0,
						"max-height": height + "px",
						"padding-top": (100*(height/width)) + "%",
						"position": "relative",
						"margin": "0 auto"
					});*/

		var svg = dom.append("svg")
			.attr("class", "groupedBar")
			/*.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.style({
				"max-width": width,
				"max-height": height,
				"position": "absolute",
				"top": 0,
				"left": 0,
				"width": "100%",
				"height": "100%"
			})*/
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

		// tooltips using d3-tip

		var tipBar = d3.tip()
			.attr("class", "d3-tip-bar")
			.direction("e")
			.offset([0, 10])
			.html(function(d) {
		return d.level + "</br>" + formatPercent(d.pct) + " (" + formatNumber(d.number) + " students)";


		});

		svg.call(tipBar);

		// axis scales

		var xScale = d3.scale.linear().range([0, widthAdj - 100]),
			yScale0 = d3.scale.ordinal().rangeRoundBands([0, heightAdj], 0.15),
			yScale1 = d3.scale.ordinal();

		var color = d3.scale.ordinal().range(["#DBB3C4", "#C07A98", "#A6426C", "5D42A6", "#DDDDDE"]);

		// domains

		data_nest = d3.nest()
			.key(function(d) { return d.group; })
			.entries(dataFiltered);

		var levels = ["Elementary","Middle","High","Other"];

		xScale.domain([0, d3.max(data, function(d) { return d.pct; })]).nice();
		yScale0.domain(data_nest.map(function(d) { return d.key; }));
		yScale1.domain(levels).rangeRoundBands([0, yScale0.rangeBand()], 0.15);

		// axes

		function formatValueAxis(d) {

			var TickValue = formatNumber(d * 100);

			return TickValue;

		};

		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatValueAxis).tickSize(-1 * heightAdj).ticks(Math.max((widthAdj - 100)/50, 2)),
			yAxis = d3.svg.axis().scale(yScale0).orient("left").outerTickSize(0);

		// draw x-axis below bars

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.call(xAxis)

		svg.append("text")
			.attr("class", "x axis")
			.attr("x", widthAdj - 100)
			.attr("dx", ".5em")
			.attr("y", heightAdj)
			.attr("dy", "3.1em")
			.attr("text-anchor", "end")
			.text("% CHRONICALLY ABSENT IN 2013-14");

		// draw national bars

		data_national = dataFiltered.filter(function(d) { return d.level == "Overall"; });

		var nationalBar = svg.selectAll(".national-bar")
			.data(data_national);

		nationalBar.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("rect")
					.attr("class","national-bar")
					.attr("x", 0)
					.attr("width", 0)
					.attr("y", function(d) { return yScale0(d.group) + (yScale0.rangeBand() / 2) - ((((1.25 * levels.length) * barWidth)) / 2); })
					.attr("height", ((1.25 * levels.length) * barWidth))
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide);

		// draw level bars

		data_noavg = dataFiltered.filter(function(d) { return d.level != "Overall"; });

		data_nest_noavg = d3.nest()
			.key(function(d) { return d.group; })
			.entries(data_noavg);

		var group = svg.selectAll(".group")
			.data(data_nest_noavg, function(d) { return d.key; });

		group.enter()
			.append("g")
				.attr("class", "group")
				.attr("transform", function(d) { return "translate(0," + yScale0(d.key) + ")"; });

		var levelBars = group.selectAll(".bar")
			.data(function(d) { return d.values; });

		levelBars.enter()
			.append("rect")
				.attr("class", "bar")
				.attr("x", 0)
				.attr("width", 0)
				.attr("y", function(d, i) { return (yScale0.rangeBand() / 2) - ((.85 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); })
				.attr("height", 0)
				.style("fill", function(d) { return color(d.level); })
				.on("mouseover", tipBar.show)
				.on("mouseout", tipBar.hide);

		var gs = graphScroll()
			.container(d3.select("#" + containerID))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#" + subcontainerID + " > div"))
			.on("active", function() {
				if (document.getElementById(sectionID).className == "graph-scroll-active") {

					svg.selectAll(".national-bar")
						.transition()
							.duration(animateTime)
							.attr("width", function(d) { return xScale(d.pct); });

					svg.selectAll(".bar")
						.transition()
							.delay(animateTime / 2)
							.duration(animateTime)
							.attr("width", function(d) { return xScale(d.pct); })
							.attr("height", barWidth);

			}});

		// draw y-axis above bars

		svg.append("g")
			.attr("class", "y axis")
			.style("opacity", 0)
			.call(yAxis)
			.transition()
				.duration(animateTime)
				.style("opacity", 1);

		// chart title (default to title1)

		svg.append("text")
			.attr("class", "title")
			.attr("x", 0 - marginLeft)
			.attr("y", 0 - marginTop)
			.attr("dy", "1em")
			.attr("text-anchor", "start")
			.attr("fill-opacity", 0)
			.text(title1)
			.transition()
				.duration(animateTime)
				.attr("fill-opacity", 1);

		// legend

		var legend = svg.selectAll(".legend")
			.data(levels.concat(["Overall"]))
			.enter()
			.append("g")
				.attr("class", "legend")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("circle")
			.attr("cx", widthAdj - 77)
			.attr("cy", 9)
			.attr("r", 6.5)
			.style("fill", color);

		legend.append("text")
			.attr("x", widthAdj - 65)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "start")
			.text(function(d) { return d; });

		// update functions

		function updateTitle(titleID) {

			svg.select(".title").remove();

			svg.append("text")
				.attr("class", "title")
				.attr("x", 0 - marginLeft)
				.attr("y", 0 - marginTop)
				.attr("dy", "1em")
				.attr("text-anchor", "start")
				.attr("fill-opacity", 0)
				.text(function() {
					if (titleID == 1) { return title1; }
					if (titleID == 2) { return title2; }
					if (titleID == 3) { return title3; }
					if (titleID == 4) { return title4; }
				})
				.transition()
					.duration(animateTime)
					.attr("fill-opacity", 1);

		};

		function updateData(subChartID) {

			// re-filter data

			dataFiltered = data.filter(function(d) { return d.subchart == subChartID; });

			var data_nest = d3.nest()
				.key(function(d) { return d.group; })
				.entries(dataFiltered);

			// update scales

			xScale.domain([0, d3.max(data, function(d) { return d.pct; })]).nice();
			yScale0.domain(data_nest.map(function(d) { return d.key; }));
			yScale1.domain(levels).rangeRoundBands([0, yScale0.rangeBand()], 0.15);

			// update national bars

			data_national = dataFiltered.filter(function(d) { return d.level == "Overall"; });

			var updateNational = svg.selectAll(".national-bar")
				.data(data_national);

			updateNational.transition()
				.duration(animateTime)
				.attr("x", 0)
				.attr("width", function(d) { return xScale(d.pct); })
				.attr("y", function(d) { return yScale0(d.group) + (yScale0.rangeBand() / 2) - ((((1.25 * levels.length) * barWidth)) / 2); })
				.attr("height", ((1.25 * levels.length) * barWidth));

			updateNational.enter()
				.append("g")
					.attr("transform", "translate(0,0)")
					.append("rect")
						.attr("class","national-bar")
						.attr("x", 0)
						.attr("width", 0)
						.attr("y", function(d) { return yScale0(d.group) + (yScale0.rangeBand() / 2) - ((((1.25 * levels.length) * barWidth)) / 2); })
						.attr("height", ((1.25 * levels.length) * barWidth))
						.on("mouseover", tipBar.show)
						.on("mouseout", tipBar.hide)
						.transition()
							.duration(animateTime)
							.attr("width", function(d) { return xScale(d.pct); })

			updateNational.exit()
				.transition()
					.duration(animateTime)
					.style("opacity", 0)
					.attr("x", 0)
					.attr("width", 0)
					.attr("height", 0)
					.remove();

			// update level bars

			data_noavg = dataFiltered.filter(function(d) { return d.level != "Overall"; });

			data_nest_noavg = d3.nest()
				.key(function(d) { return d.group; })
				.entries(data_noavg);

			var updateGroups = svg.selectAll(".group")
				.data(data_nest_noavg, function(d) { return d.key; });

			updateGroups.transition()
				.duration(animateTime)
				.attr("transform", function(d) { return "translate(0," + yScale0(d.key) + ")"; });

			updateGroups.enter()
				.append("g")
					.attr("class", "group")
					.attr("transform", function(d) { return "translate(0," + yScale0(d.key) + ")"; });

			updateGroups.exit()
				.transition()
					.duration(animateTime)
					.remove();

			updateGroups.exit()
				.selectAll(".bar")
				.transition()
					.duration(animateTime)
					.style("opacity", 0)
					.attr("x", 0)
					.attr("width", 0)
					.attr("height", 0);

			var updateBars = updateGroups.selectAll(".bar")
				.data(function(d) { return d.values; });

			updateBars.transition()
				.duration(animateTime / 2)
				.attr("x", 0)
				.attr("width", function(d) { return xScale(d.pct); })
				.attr("y", function(d, i) { return (yScale0.rangeBand() / 2) - ((.85 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); })
				.attr("height", barWidth);

			updateBars.enter()
				.append("rect")
					.attr("class", "bar")
					.attr("x", 0)
					.attr("width", 0)
					.attr("y", function(d, i) { return (yScale0.rangeBand() / 2) - ((.85 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); })
					.attr("height", 0)
					.style("fill", function(d) { return color(d.level); })
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide)
					.transition()
						.delay(animateTime / 2)
						.duration(animateTime)
						.attr("width", function(d) { return xScale(d.pct); })
						.attr("height", barWidth);

			updateBars.exit()
				.transition()
					.remove();

			// update y axis

			svg.selectAll(".y.axis")
				.transition()
					.duration(animateTime)
					.style("opacity", 0)
					.remove();

			svg.append("g")
				.attr("class", "y axis")
				.style("opacity", 0)
				.call(yAxis)
				.transition()
					.duration(animateTime)
					.style("opacity", 1);

			};

		// resize	
			
		window.addEventListener("resize", function() {
			
			// update width
			
			width = parseInt(d3.select("#" + sectionID).style("width"), 10);
			
			var widthAdj = ((width - marginLeft - margin.right) <= 100) ? (width - marginLeft - margin.right + 100) : (width - marginLeft - margin.right);

			// resize chart
						
			xScale.range([0, widthAdj - 100]);
			xAxis.ticks(Math.max((widthAdj - 100)/50, 2));
			
			/*d3.select("#" + chartID)
				.attr("width", width);*/
			
			dom.selectAll(".groupedBar")
				.attr("width", width);
			
			dom.select(".x.axis")
				.call(xAxis);
			
			dom.select("text.x.axis")
				.attr("x", widthAdj - 100)
				.attr("dx", "0.5em");
				
			dom.selectAll(".national-bar")
				.attr("width", 0);

			dom.selectAll(".bar")
				.attr("width", 0);				

			var gs2 = graphScroll()
				.container(d3.select("#" + containerID))
				.graph(d3.selectAll("#" + chartID))
				.sections(d3.selectAll("#" + subcontainerID + " > div"))
				.on("active", function() {
					if (document.getElementById(chartID).className == "graph-scroll-fixed" || document.getElementById(chartID).className == "graph-scroll-below") {

						svg.selectAll(".national-bar")
							.transition()
								.duration(animateTime)
								.attr("width", function(d) { return xScale(d.pct); });

						svg.selectAll(".bar")
							.transition()
								.delay(animateTime / 2)
								.duration(animateTime)
								.attr("width", function(d) { return xScale(d.pct); })
								.attr("height", barWidth);

				}});
				
			legend.selectAll("circle")
				.attr("cx", widthAdj - 77);

			legend.selectAll("text")
				.attr("x", widthAdj - 65);		
				
		});			
			
		});
		
	};

 /*   chart.width = function(value) {

        if (!arguments.length) return width;
        width = value;
        return chart;

    }; */

    chart.height = function(value) {

        if (!arguments.length) return height;
        height = value;
        return chart;

    };

	chart.marginTop = function(value) {

		if (!arguments.length) return marginTop;
		marginTop = value;
		return chart;

	};

	chart.marginLeft = function(value) {

		if (!arguments.length) return marginLeft;
		marginLeft = value;
		return chart;

	};

	chart.marginBottom = function(value) {

		if (!arguments.length) return marginBottom;
		marginBottom = value;
		return chart;

	};

	chart.animateTime = function(value) {

		if (!arguments.length) return animateTime;
		animateTime = value;
		return chart;

	};

	chart.barWidth = function(value) {

		if (!arguments.length) return barWidth;
		barWidth = value;
		return chart;

	};

	chart.title1 = function(value) {

		if (!arguments.length) return title1;
		title1 = value;
		return chart;

	};

	chart.title2 = function(value) {

		if (!arguments.length) return title2;
		title2 = value;
		return chart;

	};

	chart.title3 = function(value) {

		if (!arguments.length) return title3;
		title3 = value;
		return chart;

	};

	chart.title4 = function(value) {

		if (!arguments.length) return title4;
		title4 = value;
		return chart;

	};

	chart.buttonsID = function(value) {

		if (!arguments.length) return buttonsID;
		buttonsID = value;
		return chart;

	};

	chart.containerID = function(value) {

		if (!arguments.length) return containerID;
		containerID = value;
		return chart;

	};

	chart.subcontainerID = function(value) {

		if (!arguments.length) return subcontainerID;
		subcontainerID = value;
		return chart;

	};

	chart.chartID = function(value) {

		if (!arguments.length) return chartID;
		chartID = value;
		return chart;

	};

	chart.sectionID = function(value) {

		if (!arguments.length) return sectionID;
		sectionID = value;
		return chart;

	};

    chart.data = function(value) {

        if (!arguments.length) return data;
        data = value;
        if (typeof updateData === 'function') updateData();
        return chart;

    };

	return chart;

};

// this is for wrapping long axis labels
// need to examine this for bar charts because it's causing some unintended side effects...

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
};

