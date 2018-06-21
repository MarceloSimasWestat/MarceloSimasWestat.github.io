// Reusable bar chart function for chronic absenteeism storymap

function barChart() {

	// Options accessible to the caller
	// These are the default values

	var	width = [],
		height = 650,
		marginTop = 20,
		marginLeft = 100,
		marginBottom = 45,
		barWidth = 15,
		animateTime = 1000,
		title = "Generic chart title. Update me using .title()!",
		altText = "Fill in alt text for screen readers!",
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

		var width = parseInt(d3.select("#" + sectionID).style("width"), 10);
		
		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// chart title

		d3.select(this).append("div")
			.attr("class", "title")
			.text(title);

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

		svg.append("aria-label")
			.text(altText);

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

		function xDomain() { 
			if (window.innerWidth <= 736) { xScale.domain([0, d3.max(data, function(d) { return d.var3; })]).nice() }
			else { xScale.domain([0, 0.5]); }
		};
		xDomain();
		yScale.domain(data.map(function(d) { return d.var1; }));
		
		// axes

		function formatValueAxis(d) {

			var TickValue = formatNumber(d * 100);

			return TickValue;

		};

		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatValueAxis).tickSize(-1 * heightAdj).ticks(Math.max(widthAdj/100, 2)),
			yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0);

		// draw x-axis below bars

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.attr("aria-hidden", "true")
			.call(xAxis)

		svg.append("text")
			.attr("class", "x axis")
			.attr("x", widthAdj)
			.attr("dx", "0.5em")
			.attr("y", heightAdj)
			.attr("dy", "3.1em")
			.attr("text-anchor", "end")
			.attr("aria-hidden", "true")
			.text("% CHRONICALLY ABSENT IN 2013-14")

		// draw bars

		var bars = svg.selectAll("rect.bar")
			.data(data);

		bars.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("rect")
					.attr("class", function(d) {
						if (d.var1 == "Overall") { return "overallBar"; }
						else { return "bar"; }
					})
					.attr("x", 0)
					.attr("width", 0)
					.attr("y", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2) - (barWidth/2); })
					.attr("height", barWidth)
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide)
					.append("aria-label")
						.text(function(d) { return "In 2013-14, " + formatPercent(d.var3) + " of " + d.var1 + " students, or " + formatNumber(d.var2) + " students, were chronically absent."; });

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

					svg.selectAll("rect.overallBar")
						.transition()
						.duration(animateTime)
						.attr("width", function(d) { return xScale(d.var3); });

			}});

		// draw y-axis above bars

		svg.append("g")
			.attr("class", "y axis")
			.attr("aria-hidden", "true")
			.call(yAxis)
			
		// resize

		window.addEventListener("resize", function() {

			// update width

			width = parseInt(d3.select("#" + sectionID).style("width"), 10);
			widthAdj = width - marginLeft - margin.right;

			// resize chart

			xScale.range([0, widthAdj]);
			xDomain();
			xAxis.ticks(Math.max(widthAdj/100, 2));

			/*d3.select("#" + chartID)
				.attr("width", width);*/

			dom.selectAll(".bar-chart")
				.attr("width", width);

			dom.select(".x.axis")
				.call(xAxis);

			dom.select("text.x.axis")
				.attr("x", widthAdj)
				.attr("dx", "0.5em");

			dom.selectAll("rect")
				.attr("width", 0);

			dom.selectAll("rect")
				.attr("width", 0);

			var gs2 = graphScroll()
			.container(d3.select("#" + containerID))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#" + subcontainerID + " > div"))
			.on("active", function() {
				if (document.getElementById(sectionID).className == "graph-scroll-active") {

					svg.selectAll("rect")
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

	chart.altText = function(value) {

		if (!arguments.length) return altText;
		altText = value;
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
		marginBottom = 25,
		animateTime = 1000,
		colWidth = 15,
		title = "Generic chart title. Update me using .title()!",
		altText = "Fill in alt text for screen readers!",
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

		// chart title

		d3.select(this).append("div")
			.attr("class", "title")
			.text(title);

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

		svg.append("aria-label")
			.text(altText);

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
		yScale.domain([0, 0.5]);

		// axes

		function formatValueAxis(d) {

			var TickValue = formatNumber(d * 100);

			return TickValue;

		};

		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0),
			yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(formatValueAxis).tickSize(-1 * widthAdj).ticks(Math.max(heightAdj/100, 2));

		// draw y-axis under columns

		svg.append("g")
			.attr("class", "y axis")
			.attr("aria-hidden", "true")
			.call(yAxis)
			.selectAll("text")

		svg.append("text")
			.attr("class", "y axis")
			.attr("x", -15)
			.attr("y", "-2.1em")
			.attr("aria-hidden", "true")
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
					.on("mouseout", tipCol.hide)
					.append("aria-label")
						.text(function(d) { return "In 2013-14, " + formatPercent(d.var3) + " of " + d.var1 + " students, or " + formatNumber(d.var2) + " students, were chronically absent."; });

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
			.attr("aria-hidden", "true")
			.call(xAxis)
			.selectAll(".tick text")
				.call(wrap, xScale.rangeBand());

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
					if (document.getElementById(sectionID).className == "graph-scroll-active") {

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

	chart.altText = function(value) {

		if (!arguments.length) return altText;
		altText = value;
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

// Reusable dot plot function for chronic absenteeism storymap

function dotPlot() {

	// Options accessible to the caller
	// These are the default values

	var	width = [],
		height = 500,
		marginTop = 20,
		marginLeft = 100,
		marginBottom = 45,
		dotSize = 5,
		animateTime = 1000,
		title = "Generic chart title. Update me using .title()!",
		altText = "Fill in alt text for screen readers!",
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

		// chart title

		d3.select(this).append("div")
			.attr("class", "title")
			.text(title);

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

		svg.append("aria-label")
			.text(altText);

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

		function xDomain() { 
			if (window.innerWidth <= 736) { xScale.domain([0, d3.max(data, function(d) { return d.var3; })]).nice() }
			else { xScale.domain([0, 0.5]); }
		};
		xDomain();
		yScale.domain(data.map(function(d, i) { return d.var1; }));

		// axes

		function formatValueAxis(d) {

			var TickValue = formatNumber(d * 100);

			return TickValue;

		};

		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatValueAxis).tickSize(-1 * heightAdj).ticks(Math.max(widthAdj/100, 2)),
			yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0);

		// draw x-axis below bars

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.attr("aria-hidden", "true")
			.call(xAxis)

		svg.append("text")
			.attr("class", "x axis")
			.attr("x", widthAdj)
			.attr("dx", "0.5em")
			.attr("y", heightAdj)
			.attr("dy", "3.1em")
			.attr("aria-hidden", "true")
			.attr("text-anchor", "end")
			.text("% CHRONICALLY ABSENT IN 2013-14");

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
					.attr("clip-path", function() { return "url(#clip" + chartID + ")"; })
					.attr("cx", 0)
					.attr("cy", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
					.attr("r", dotSize/2)
					.on("mouseover", tipDot.show)
					.on("mouseout", tipDot.hide)
					.append("aria-label")
						.text(function(d) { return "In 2013-14, " + formatPercent(d.var3) + " of " + d.var1 + " students, or " + formatNumber(d.var2) + " students, were chronically absent."; });

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
				.attr("id", function() { return "clip" + chartID; })
					.append("rect")
						.attr("width", widthAdj + margin.right)
						.attr("height", heightAdj);

		// draw y-axis above

		svg.append("g")
			.attr("class", "y axis")
			.attr("aria-hidden", "true")
			.call(yAxis)

		// resize

		window.addEventListener("resize", function() {

			// update width

			width = parseInt(d3.select("#" + sectionID).style("width"), 10);
			widthAdj = width - marginLeft - margin.right;

			// resize chart

			xScale.range([0, widthAdj]);
			xDomain();
			xAxis.ticks(Math.max(widthAdj/100, 2));

			/*d3.select("#" + chartID)
				.attr("width", width);*/

			dom.selectAll(".dotPlot")
				.attr("width", width);

			dom.select(".x.axis")
				.call(xAxis);

			dom.select("text.x.axis")
				.attr("x", widthAdj)
				.attr("dx", "0.5em");

			dom.selectAll("line.dotLine")
				.attr("x2", 0);

			dom.selectAll(".dot")
				.attr("cx", 0)
				.attr("r", dotSize/2);

			var gs2 = graphScroll()
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

	chart.altText = function(value) {

		if (!arguments.length) return altText;
		altText = value;
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

// Grouped column chart function for chronic absenteeism storymap

function groupedCol() {

	// Options accessible to the caller
	// These are the default values

	var	width = [],
		maxWidth = 650,
		height = 500,
		marginTop = 60,
		marginLeft = 20,
		marginBottom = 45,
		animateTime = 1000,
		colWidth = 15,
		title1 = "Generic chart title. Update me using .title1()!",
		title2 = "Generic chart title. Update me using .title2()!",
		title3 = "Generic chart title. Update me using .title3()!",
		altText1 = "Fill in alt text for screen readers! Use .altText1().",
		altText2 = "Fill in alt text for screen readers! Use .altText2().",
		altText3 = "Fill in alt text for screen readers! Use .altText3().",
		containerID = [],
		subcontainerID = [],
		chartID = [],
		sectionID = [],
		data = [];

	var updateTitle,
		updateAltText,
		updateData;

	var marginBottom1;

	marginBottom1 = marginBottom;

	function chart(selection) {
		selection.each(function() {

		// filter data to show LEP by default

		var subchartID = "1-5";

		dataFiltered = data.filter(function(d) { return d.chart == subchartID; });

		// formats

		var	formatNumber = d3.format(",f"),
			formatPercent = d3.format(",.1%");

		// margins; adjust width and height to account for margins

		if (maxWidth < parseInt(d3.select("#" + sectionID).style("width"), 10)) { width = maxWidth; }
		else { width = parseInt(d3.select("#" + sectionID).style("width"), 10); }

		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// buttons for filtering

		var buttons = d3.select(this)
			.append("div")
				.style({
					"margin": "0 auto"
				})
				.attr("id", "buttons" + chartID)
				.attr("class", "filters")

		d3.select("#buttons" + chartID)
			.append("button")
			.attr("class", "filterButton buttonSelected")
			.text("English Learner Status")
			.on("click", function() {

				updateData("1-5");
				updateTitle(1);
				updateAltText(1);

				d3.select("#buttons" + chartID)
					.selectAll("button")
						.attr("class", "filterButton");

				d3.select(this)
					.classed("buttonSelected", true);

			});

		d3.select("#buttons" + chartID)
			.append("button")
			.attr("class", "filterButton")
			.text("Disability Status")
			.on("click", function() {

				updateData("1-4");
				updateTitle(2);
				updateAltText(2);

				d3.select("#buttons" + chartID)
					.selectAll("button")
						.attr("class", "filterButton");

				d3.select(this)
					.classed("buttonSelected", true);

			});

		d3.select("#buttons" + chartID)
			.append("button")
			.attr("class", "filterButton")
			.text("Gender")
			.on("click", function() {

				updateData("1-3");
				updateTitle(3);
				updateAltText(3);

				d3.select("#buttons" + chartID)
					.selectAll("button")
						.attr("class", "filterButton");

				d3.select(this)
					.classed("buttonSelected", true);

			});

		d3.select("#buttons" + chartID)
			.append("p");

		// chart title

		d3.select(this).append("div")
			.attr("id", "title" + chartID)
			/*.style("width", function() {
				if (document.getElementById(sectionID).width < maxWidth) { return document.getElementById(sectionID).width; }
				else { return maxWidth; }
			})*/
			.style("margin", "0 auto")
			/*.style("max-width", maxWidth + "px")*/
			.html("<span class = 'title'>" + title1 + "</span>");

		// selections

		var dom = d3.select(this)
			.append("div")
			.attr("id", chartID)
			.style("width", function() {
				if (document.getElementById(sectionID).width < maxWidth) { return document.getElementById(sectionID).width; }
				else { return maxWidth; }
			})
			.style("margin", "0 auto")
			.style("max-width", maxWidth + "px")
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

		svg.append("aria-label")
			.text(altText1);

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

		xScale.domain(dataFiltered.map(function(d) { return d.var1; }));
		yScale.domain([0, 0.5]);

		// axes

		function formatValueAxis(d) {

			var TickValue = formatNumber(d * 100);

			return TickValue;

		};

		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0),
			yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(formatValueAxis).tickSize(-1 * widthAdj).ticks(Math.max(heightAdj/100, 2));

		// draw y-axis under columns

		svg.append("g")
			.attr("class", "y axis")
			.attr("aria-hidden", "true")
			.call(yAxis);

		svg.append("text")
			.attr("class", "y axis")
			.attr("x", -15)
			.attr("y", "-2.1em")
			.attr("text-anchor", "start")
			.attr("aria-hidden", "true")
			.text("% CHRONICALLY ABSENT IN 2013-14");

		// draw columns

		var cols = svg.selectAll("rect.column")
			.data(dataFiltered);

		cols.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("rect")
					.attr("class", function(d) {
						if (d.var1 == "Overall") { return "overallColumn"; }
						else { return "column"; }
					})
					.attr("x", function(d, i) { return xScale(d.var1) + (xScale.rangeBand() / 2) - (colWidth / 2); })
					.attr("width", colWidth)
					.attr("y", heightAdj)
					.attr("height", 0)
					.on("mouseover", tipCol.show)
					.on("mouseout", tipCol.hide)
					.append("aria-label")
						.text(function(d) { return "In 2013-14, " + formatPercent(d.var3) + " of " + d.var1 + " students, or " + formatNumber(d.var2) + " students, were chronically absent."; });

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

					svg.selectAll("rect.overallColumn")
						.transition()
							.duration(animateTime)
							.attr("height", function(d) { return heightAdj - yScale(d.var3); })
							.attr("y", function(d) { return yScale(d.var3); });

			}});

		// draw x-axis above columns

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.attr("aria-hidden", "true")
			.call(xAxis)
			.selectAll(".tick text")
				.call(wrap, xScale.rangeBand());

		// update functions

		function updateTitle(titleID) {

			d3.select("#title" + chartID)
				.html(function() {
					if (titleID == 1) { return "<span class = 'title'>" + title1 + "</span>"; }
					if (titleID == 2) { return "<span class = 'title'>" + title2 + "</span>"; }
					if (titleID == 3) { return "<span class = 'title'>" + title3 + "</span>"; }
				})

		};

		function updateAltText(altTextID) {

			svg.select("aria-label")
				.text(function() {
					if (altTextID == 1) { return altText1; }
					if (altTextID == 2) { return altText2; }
					if (altTextID == 3) { return altText3; }
				})

		};

		function updateData(subchartID) {

			// re-filter data

			dataFiltered = data.filter(function(d) { return d.chart == subchartID; });

			// update scales

			xScale.domain(dataFiltered.map(function(d) { return d.var1; }));
			yScale.domain([0, 0.5]);

			// update columns

			var updateCols = svg.selectAll("rect")
				.data(dataFiltered);

			updateCols.transition()
				.duration(animateTime)
				.attr("x", function(d, i) { return xScale(d.var1) + (xScale.rangeBand() / 2) - (colWidth / 2); })
				.attr("width", colWidth)
				.attr("height", function(d) { return heightAdj - yScale(d.var3); })
				.attr("y", function(d) { return yScale(d.var3); });

			updateCols.select("aria-label")
				.text(function(d) { return "In 2013-14, " + formatPercent(d.var3) + " of " + d.var1 + " students, or " + formatNumber(d.var2) + " students, were chronically absent."; });

			updateCols.enter()
				.append("g")
					.attr("transform", "translate(0,0)")
					.append("rect")
						.attr("class", function(d) {
							if (d.var1 == "Overall") { return "overallColumn"; }
							else { return "column"; }
						})
						.attr("x", function(d, i) { return xScale(d.var1) + (xScale.rangeBand() / 2) - (colWidth / 2); })
						.attr("width", colWidth)
						.attr("y", heightAdj)
						.attr("height", 0)
						.on("mouseover", tipCol.show)
						.on("mouseout", tipCol.hide)
						.transition()
							.duration(animateTime)
							.attr("height", function(d) { return heightAdj - yScale(d.var3); })
							.attr("y", function(d) { return yScale(d.var3); });

			updateCols.select("rect")
				.append("aria-label")
					.text(function(d) { return "In 2013-14, " + formatPercent(d.var3) + " of " + d.var1 + " students, or " + formatNumber(d.var2) + " students, were chronically absent."; });

			updateCols.exit()
				.transition()
					.duration(animateTime)
					.style("opacity", 0)
					.attr("width", 0)
					.attr("y", heightAdj)
					.attr("height", 0)
					.remove();

			// update x axis

			svg.selectAll(".x.axis")
				/* .transition()
					.duration(animateTime)
					.style("opacity", 0) */
					.remove();

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + heightAdj + ")")
				.style("opacity", 1)
				.attr("aria-hidden", "true")
				.call(xAxis)
				.selectAll(".tick text")
					.call(wrap, xScale.rangeBand());

			/*svg.selectAll(".x.axis")
				.transition()
					.duration(animateTime)
					.style("opacity", 1);*/

			};

		// resize

		window.addEventListener("resize", function() {

			// update width

			if (maxWidth < parseInt(d3.select("#" + sectionID).style("width"), 10)) { width = maxWidth; }
			else { width = parseInt(d3.select("#" + sectionID).style("width"), 10); }
			widthAdj = width - marginLeft - margin.right;

			// Update height if width < 575

			if (parseInt(d3.select("#" + sectionID).style("width"), 10) < 575) { marginBottom = marginBottom1 + 20; }
			else { marginBottom = marginBottom1 };

			heightAdj = height - marginTop - marginBottom;

		/*	d3.select("#title" + chartID)
				.style("width", function() {
					if (document.getElementById(sectionID).width < maxWidth) { return document.getElementById(sectionID).width; }
					else { return maxWidth; }
				})
				.style("margin", "0 auto")
				.style("max-width", maxWidth + "px");*/

			d3.select("#" + chartID)
				.style("width", function() {
					if (document.getElementById(sectionID).width < maxWidth) { return document.getElementById(sectionID).width; }
					else { return maxWidth; }
				})
				.style("margin", "0 auto")
				.style("max-width", maxWidth + "px");

			// resize chart

			xScale.rangeRoundBands([0, widthAdj], .5);
			yScale = d3.scale.linear().range([heightAdj, 0]);
			yAxis.scale(yScale).tickSize(-1 * widthAdj).ticks(Math.max(heightAdj/100, 2));

			dom.selectAll(".col-chart")
				.attr("width", width)
				.attr("height", height);

			dom.select(".x.axis")
				.attr("transform", "translate(0," + heightAdj + ")")
				.call(xAxis)
				.selectAll(".tick text")
					.call(wrap, xScale.rangeBand());

			dom.select(".y.axis")
				.call(yAxis);

			dom.selectAll("rect.column")
				.attr("x", function(d, i) { return xScale(d.var1) + (xScale.rangeBand() / 2) - (colWidth / 2); })
				.attr("height", 0)
				.attr("y", heightAdj);

			dom.selectAll("rect.overallColumn")
				.attr("x", function(d, i) { return xScale(d.var1) + (xScale.rangeBand() / 2) - (colWidth / 2); })
				.attr("height", 0)
				.attr("y", heightAdj);

			var gs2 = graphScroll()
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

					svg.selectAll("rect.overallColumn")
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

    chart.maxWidth = function(value) {

        if (!arguments.length) return maxWidth;
        maxWidth = value;
        return chart;

    };

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

	chart.altText1 = function(value) {

		if (!arguments.length) return altText1;
		altText1 = value;
		return chart;

	};

	chart.altText2 = function(value) {

		if (!arguments.length) return altText2;
		altText2 = value;
		return chart;

	};

	chart.altText3 = function(value) {

		if (!arguments.length) return altText3;
		altText3 = value;
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

// Grouped dot plot function for chronic absenteeism storymap

function groupedDot() {

	// Options accessible to the caller
	// These are the default values

	var	width = [],
		height = 650,
		marginTop = 20,
		marginLeft = 100,
		marginBottom = 45,
		dotSize = 5,
		animateTime = 1000,
		barWidth = 15,
		title1 = "Generic chart title #1. Update me using .title1()!",
		title2 = "Generic chart title #2. Update me using .title2()!",
		title3 = "Generic chart title #3. Update me using .title3()!",
		title4 = "Generic chart title #4. Update me using .title4()!",
		altText1 = "Fill in alt text for screen readers! Use .altText1().",
		altText2 = "Fill in alt text for screen readers! Use .altText2().",
		altText3 = "Fill in alt text for screen readers! Use .altText3().",
		altText4 = "Fill in alt text for screen readers! Use .altText4().",
		containerID = [],
		subcontainerID = [],
		chartID = [],
		sectionID = [],
		data = [];

	var updateTitle,
		updateAltText,
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

		width = (parseInt(d3.select("#" + sectionID).style("width"), 10) < 360) ? 360 : parseInt(d3.select("#" + sectionID).style("width"), 10);

		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// buttons for filtering

		var buttons = d3.select(this)
			.append("div")
			.style({
					"margin": "0 auto"
				})
				.attr("id", "buttons" + chartID)
				.attr("class", "filters")

		d3.select("#buttons" + chartID)
			.append("button")
			.attr("class", "filterButton")
			.text("Race & Ethnicity")
			.on("click", function() {

				updateData(1);
				updateTitle(1);
				updateAltText(1);

			});

		d3.select("#buttons" + chartID)
			.append("button")
			.attr("class", "filterButton")
			.text("Gender")
			.on("click", function() {

				updateData(2);
				updateTitle(2);
				updateAltText(2);

			});

		d3.select("#buttons" + chartID)
			.append("button")
			.attr("class", "filterButton")
			.text("Disability Status")
			.on("click", function() {

				updateData(3);
				updateTitle(3);
				updateAltText(3);

			});

		d3.select("#buttons" + chartID)
			.append("button")
			.attr("class", "filterButton")
			.text("English Learner Status")
			.on("click", function() {

				updateData(4);
				updateTitle(4);
				updateAltText(4);

			});

		d3.select("#buttons" + chartID)
			.append("p");

		// chart title

		d3.select(this).append("div")
			.attr("id", "title" + chartID)
			.html("<span class = 'title'>" + title1 + "</span>");

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
			.attr("class", "groupedDot")
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

		svg.append("aria-label")
			.text(altText1);

		// tooltips using d3-tip

		var tipDot = d3.tip()
			.attr("class", "d3-tip-bar")
			.direction("e")
			.offset([0, 10])
			.html(function(d) {
		return d.level + "</br>" + formatPercent(d.pct) + " (" + formatNumber(d.number) + " students)";


		});

		svg.call(tipDot);

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

		xScale.domain([0, 0.5]);
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
			.attr("aria-hidden", "true")
			.call(xAxis)

		svg.append("text")
			.attr("class", "x axis")
			.attr("x", widthAdj - 100)
			.attr("dx", ".5em")
			.attr("y", heightAdj)
			.attr("dy", "3.1em")
			.attr("aria-hidden", "true")
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
					.on("mouseover", tipDot.show)
					.on("mouseout", tipDot.hide);

		// draw dots and lines

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

		var lines = group.selectAll("line.dotLine")
			.data(function(d) { return d.values; });

		lines.enter()
			.append("g")
			.attr("transform", "translate(0,0)")
			.append("line")
				.attr("class", "dotLine")
				.attr("x1", 0)
				.attr("x2", 0)
				.attr("y1", function(d, i) { return (yScale0.rangeBand() / 2) - ((.65 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); })
				.attr("y2", function(d, i) { return (yScale0.rangeBand() / 2) - ((.65 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); });

		var dots = group.selectAll("circle.dot")
			.data(function(d) { return d.values; });

		dots.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("circle")
					.attr("class", "dot")
					.attr("clip-path", function() { return "url(#clip" + chartID + ")"; })
					.attr("cx", 0)
					.attr("cy", function(d, i) { return (yScale0.rangeBand() / 2) - ((.65 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); })
					.attr("r", dotSize/2)
					.style("fill", function(d) { return color(d.level); })
					.on("mouseover", tipDot.show)
					.on("mouseout", tipDot.hide);

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

					svg.selectAll("line.dotLine")
						.transition()
							.duration(animateTime)
							.attr("x2", function(d) { return xScale(d.pct); })
							.each("end", function(d) {
								d3.select(this)
									.transition()
										.duration(animateTime)
										.attr("x2", function(d) { return xScale(d.pct) - dotSize; });
							});

					svg.selectAll("circle.dot")
						.transition()
							.duration(animateTime)
							.attr("cx", function(d) { return xScale(d.pct); })
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
				.attr("id", function() { return "clip" + chartID; })
					.append("rect")
						.attr("width", widthAdj + margin.right)
						.attr("height", heightAdj);

		// draw y-axis above bars

		svg.append("g")
			.attr("class", "y axis")
			.style("opacity", 0)
			.attr("aria-hidden", "true")
			.call(yAxis)
			.transition()
				.duration(animateTime)
				.style("opacity", 1);

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

			d3.select("#title" + chartID)
				.html(function() {
					if (titleID == 1) { return "<span class = 'title'>" + title1 + "</span>"; }
					if (titleID == 2) { return "<span class = 'title'>" + title2 + "</span>"; }
					if (titleID == 3) { return "<span class = 'title'>" + title3 + "</span>"; }
					if (titleID == 4) { return "<span class = 'title'>" + title4 + "</span>"; }
				})

		};

		function updateAltText(altTextID) {

			svg.select("aria-label")
				.text(function() {
					if (altTextID == 1) { return altText1; }
					if (altTextID == 2) { return altText2; }
					if (altTextID == 3) { return altText3; }
					if (altTextID == 4) { return altText4; }
				})

		};

		function updateData(subChartID) {

			// re-filter data

			dataFiltered = data.filter(function(d) { return d.subchart == subChartID; });

			var data_nest = d3.nest()
				.key(function(d) { return d.group; })
				.entries(dataFiltered);

			// update scales

			xScale.domain([0, 0.5]);
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
						.on("mouseover", tipDot.show)
						.on("mouseout", tipDot.hide)
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

			// update dots and lines

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
				.selectAll(".dotLine")
				.transition()
					.duration(animateTime)
					.style("opacity", 0)
					.attr("x1", 0)
					.attr("x2", 0);

			updateGroups.exit()
				.selectAll(".dot")
				.transition()
					.duration(animateTime)
					.style("opacity", 0)
					.attr("r", 0)
					.attr("cx", 0);

			var updateLines = updateGroups.selectAll("line.dotLine")
				.data(function(d) { return d.values; });

			updateLines.transition()
				.duration(animateTime / 2)
				.attr("x1", 0)
				.attr("x2", function(d) { return xScale(d.pct); })
				.attr("y1", function(d, i) { return (yScale0.rangeBand() / 2) - ((.65 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); })
				.attr("y2", function(d, i) { return (yScale0.rangeBand() / 2) - ((.65 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); });

			updateLines.enter()
				.append("g")
				.attr("transform", "translate(0,0)")
				.append("line")
					.attr("class", "dotLine")
					.attr("x1", 0)
					.attr("x2", 0)
					.attr("y1", function(d, i) { return (yScale0.rangeBand() / 2) - ((.65 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); })
					.attr("y2", function(d, i) { return (yScale0.rangeBand() / 2) - ((.65 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); })
					.transition()
						.duration(animateTime)
						.attr("x2", function(d) { return xScale(d.pct); })
						.each("end", function(d) {
							d3.select(this)
								.transition()
									.duration(animateTime)
									.attr("x2", function(d) { return xScale(d.pct) - dotSize; });
						});

			updateLines.exit()
				.transition()
					.remove();

			var updateDots = updateGroups.selectAll(".dot")
				.data(function(d) { return d.values; });

			updateDots.transition()
				.duration(animateTime / 2)
				.attr("cx", function(d) { return xScale(d.pct); })
				.attr("cy", function(d, i) { return (yScale0.rangeBand() / 2) - ((.65 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); });

			updateDots.enter()
				.append("g")
					.attr("transform", "translate(0,0)")
					.append("circle")
						.attr("class", "dot")
						.attr("clip-path", function() { return "url(#clip" + chartID + ")"; })
						.attr("cx", 0)
						.attr("cy", function(d, i) { return (yScale0.rangeBand() / 2) - ((.65 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); })
						.attr("r", dotSize/2)
						.style("fill", function(d) { return color(d.level); })
						.on("mouseover", tipDot.show)
						.on("mouseout", tipDot.hide)
						.transition()
							.duration(animateTime)
							.attr("cx", function(d) { return xScale(d.pct); })
							.each("end", function(d) {
								d3.select(this)
									.transition()
										.duration(animateTime)
										.attr("r", dotSize);
							});

			updateDots.exit()
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

			width = (parseInt(d3.select("#" + sectionID).style("width"), 10) < 360) ? 360 : parseInt(d3.select("#" + sectionID).style("width"), 10);
			widthAdj = width - marginLeft - margin.right;

			// resize chart

			xScale.range([0, widthAdj - 100]);
			xAxis.ticks(Math.max((widthAdj - 100)/50, 2))

			/*d3.select("#" + chartID)
				.attr("width", width);*/

			dom.selectAll(".groupedDot")
				.attr("width", width);

			dom.select(".x.axis")
				.call(xAxis);

			dom.select("text.x.axis")
				.attr("x", widthAdj - 100)
				.attr("dx", "0.5em");

			dom.selectAll(".national-bar")
				.attr("width", 0);

			dom.selectAll(".dotLine")
				.attr("x2", 0);

			dom.selectAll(".dot")
				.attr("cx", 0)
				.attr("r", dotSize/2);

			var gs2 = graphScroll()
				.container(d3.select("#" + containerID))
				.graph(d3.selectAll("#" + chartID))
				.sections(d3.selectAll("#" + subcontainerID + " > div"))
				.on("active", function() {
					if (document.getElementById(sectionID).className == "graph-scroll-active") {

						svg.selectAll(".national-bar")
							.transition()
								.duration(animateTime)
								.attr("width", function(d) { return xScale(d.pct); });

						svg.selectAll("line.dotLine")
							.transition()
								.duration(animateTime)
								.attr("x2", function(d) { return xScale(d.pct); })
								.each("end", function(d) {
									d3.select(this)
										.transition()
											.duration(animateTime)
											.attr("x2", function(d) { return xScale(d.pct) - dotSize; });
								});

						svg.selectAll("circle.dot")
							.transition()
								.duration(animateTime)
								.attr("cx", function(d) { return xScale(d.pct); })
								.each("end", function(d) {
									d3.select(this)
										.transition()
											.duration(animateTime)
											.attr("r", dotSize);
								});

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

	chart.dotSize = function(value) {

		if (!arguments.length) return dotSize;
		dotSize = value;
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

	chart.altText1 = function(value) {

		if (!arguments.length) return altText1;
		altText1 = value;
		return chart;

	};

	chart.altText2 = function(value) {

		if (!arguments.length) return altText2;
		altText2 = value;
		return chart;

	};

	chart.altText3 = function(value) {

		if (!arguments.length) return altText3;
		altText3 = value;
		return chart;

	};

	chart.altText4 = function(value) {

		if (!arguments.length) return altText4;
		altText4 = value;
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

// Grouped bar chart function for chronic absenteeism storymap

function groupedBar() {

	// Options accessible to the caller
	// These are the default values

	var	width = [],
		height = 650,
		marginTop = 20,
		marginLeft = 100,
		marginBottom = 45,
		animateTime = 1000,
		barWidth = 15,
		title1 = "Generic chart title #1. Update me using .title1()!",
		title2 = "Generic chart title #2. Update me using .title2()!",
		title3 = "Generic chart title #3. Update me using .title3()!",
		title4 = "Generic chart title #4. Update me using .title4()!",
		altText1 = "Fill in alt text for screen readers! Use .altText1().",
		altText2 = "Fill in alt text for screen readers! Use .altText2().",
		altText3 = "Fill in alt text for screen readers! Use .altText3().",
		altText4 = "Fill in alt text for screen readers! Use .altText4().",
		containerID = [],
		subcontainerID = [],
		chartID = [],
		sectionID = [],
		data = [];

	var updateTitle,
		updateAltText,
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

		width = (parseInt(d3.select("#" + sectionID).style("width"), 10) < 360) ? 360 : parseInt(d3.select("#" + sectionID).style("width"), 10);

		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// buttons for filtering

		var buttons = d3.select(this)
			.append("div")
			.style({
					"margin": "0 auto"
				})
				.attr("id", "buttons" + chartID)
				.attr("class", "filters")

		d3.select("#buttons" + chartID)
			.append("button")
			.attr("class", "filterButton buttonSelected")
			.text("Race & Ethnicity")
			.on("click", function() {

				updateData(1);
				updateTitle(1);
				updateAltText(1);

				d3.select("#buttons" + chartID)
					.selectAll("button")
						.attr("class", "filterButton");

				d3.select(this)
					.classed("buttonSelected", true);

			});

		d3.select("#buttons" + chartID)
			.append("button")
			.attr("class", "filterButton")
			.text("Gender")
			.on("click", function() {

				updateData(2);
				updateTitle(2);
				updateAltText(2);

				d3.select("#buttons" + chartID)
					.selectAll("button")
						.attr("class", "filterButton");

				d3.select(this)
					.classed("buttonSelected", true);

			});

		d3.select("#buttons" + chartID)
			.append("button")
			.attr("class", "filterButton")
			.text("Disability Status")
			.on("click", function() {

				updateData(3);
				updateTitle(3);
				updateAltText(3);

				d3.select("#buttons" + chartID)
					.selectAll("button")
						.attr("class", "filterButton");

				d3.select(this)
					.classed("buttonSelected", true);

			});

		d3.select("#buttons" + chartID)
			.append("button")
			.attr("class", "filterButton")
			.text("English Learner Status")
			.on("click", function() {

				updateData(4);
				updateTitle(4);
				updateAltText(4);

				d3.select("#buttons" + chartID)
					.selectAll("button")
						.attr("class", "filterButton");

				d3.select(this)
					.classed("buttonSelected", true);

			});

		d3.select("#buttons" + chartID)
			.append("p");

		// chart title

		d3.select(this).append("div")
			.attr("id", "title" + chartID)
			.html("<span class = 'title'>" + title1 + "</span>");

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

		svg.append("aria-label")
			.text(altText1);

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

		// domains

		data_nest = d3.nest()
			.key(function(d) { return d.group; })
			.entries(dataFiltered);

		data_levels = d3.nest()
			.key(function(d) { return d.level; })
			.entries(dataFiltered);
			
		var levels = ["Elementary","Middle","High","Other"];

		function xDomain() { 
			if (window.innerWidth <= 736) { 
			
				xScale.domain([0, d3.max(data, function(d) { return d.pct; })]).nice()
				
			}
			else { xScale.domain([0, 0.5]); }
		};
		xDomain();
		yScale0.domain(data_nest.map(function(d) { return d.key; }));
		yScale1.domain(levels).rangeRoundBands([0, yScale0.rangeBand()], 0.15);

		// axes

		function formatValueAxis(d) {

			var TickValue = formatNumber(d * 100);

			return TickValue;

		};

		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatValueAxis).tickSize(-1 * heightAdj).ticks(Math.max((widthAdj - 100)/100, 2)),
			yAxis = d3.svg.axis().scale(yScale0).orient("left").outerTickSize(0);

		// draw x-axis below bars

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.attr("aria-hidden", "true")
			.call(xAxis)

		svg.append("text")
			.attr("class", "x axis")
			.attr("x", widthAdj - 100)
			.attr("dx", ".5em")
			.attr("y", heightAdj)
			.attr("dy", "3.1em")
			.attr("text-anchor", "end")
			.attr("aria-hidden", "true")
			.text("% CHRONICALLY ABSENT IN 2013-14");

		// draw national bars

		data_national = dataFiltered.filter(function(d) { return d.level == "Overall"; });

		var nationalBar = svg.selectAll(".national-bar")
			.data(data_national);

		nationalBar.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("rect")
					.attr("class", function(d) { return "national-bar " + d.level; })
					.attr("x", 0)
					.attr("width", 0)
					.attr("y", function(d) { return yScale0(d.group) + (yScale0.rangeBand() / 2) - ((((1.25 * levels.length) * barWidth)) / 2); })
					.attr("height", ((1.25 * levels.length) * barWidth))
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide)
					.append("aria-label")
						.text(function(d) { return "In 2013-14, " + d.level + ", " + formatPercent(d.pct) + " of " + d.group + " students, or " + formatNumber(d.number) + " students, were chronically absent."; });

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
				.attr("class", function(d) { return "bar " + d.level; })
				.attr("x", 0)
				.attr("width", 0)
				.attr("y", function(d, i) { return (yScale0.rangeBand() / 2) - ((.85 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); })
				.attr("height", 0)
				//.style("fill", function(d) { return color(d.level); }) 
				.on("mouseover", tipBar.show)
				.on("mouseout", tipBar.hide)
				.append("aria-label")
					.text(function(d) { return "In 2013-14, " + formatPercent(d.pct) + " of " + d.level + " school " + d.group + " students, or " + formatNumber(d.number) + " students, were chronically absent."; });

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
			.attr("aria-hidden", "true")
			.call(yAxis)
			.transition()
				.duration(animateTime)
				.style("opacity", 1);

		// legend

		var legend = svg.selectAll(".legend")
			.data(levels.concat(["Overall"]))
			.enter()
			.append("g")
				.attr("class", "legend")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("circle")
			.attr("class", function(d) { return d; })
			.attr("cx", widthAdj - 77)
			.attr("cy", 9)
			.attr("r", 6.5);
			//.style("fill", color);

		legend.append("text")
			.attr("x", widthAdj - 65)
			.attr("y", 9)
			.attr("dy", ".35em")
			.attr("aria-hidden", "true")
			.style("text-anchor", "start")
			.text(function(d) { return d; });

		// update functions

		function updateTitle(titleID) {

			d3.select("#title" + chartID)
				.html(function() {
					if (titleID == 1) { return "<span class = 'title'>" + title1 + "</span>"; }
					if (titleID == 2) { return "<span class = 'title'>" + title2 + "</span>"; }
					if (titleID == 3) { return "<span class = 'title'>" + title3 + "</span>"; }
					if (titleID == 4) { return "<span class = 'title'>" + title4 + "</span>"; }
				})

		};

		function updateAltText(altTextID) {

			svg.select("aria-label")
				.text(function() {
					if (altTextID == 1) { return altText1; }
					if (altTextID == 2) { return altText2; }
					if (altTextID == 3) { return altText3; }
					if (altTextID == 4) { return altText4; }
				})

		};

		function updateData(subChartID) {

			// re-filter data

			dataFiltered = data.filter(function(d) { return d.subchart == subChartID; });

			var data_nest = d3.nest()
				.key(function(d) { return d.group; })
				.entries(dataFiltered);

			// update scales

			xDomain();
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

			updateNational.select("aria-label")
				.text(function(d) { return "In 2013-14, " + d.level + ", " + formatPercent(d.pct) + " of " + d.group + " students, or " + formatNumber(d.number) + " students, were chronically absent."; });

			updateNational.enter()
				.append("g")
					.attr("transform", "translate(0,0)")
					.append("rect")
						.attr("class", function(d) { return "national-bar " + d.level; })
						.attr("x", 0)
						.attr("width", 0)
						.attr("y", function(d) { return yScale0(d.group) + (yScale0.rangeBand() / 2) - ((((1.25 * levels.length) * barWidth)) / 2); })
						.attr("height", ((1.25 * levels.length) * barWidth))
						.on("mouseover", tipBar.show)
						.on("mouseout", tipBar.hide)
						.transition()
							.duration(animateTime)
							.attr("width", function(d) { return xScale(d.pct); })

			updateNational.selectAll(".national-bar")
				.append("aria-label")
					.text(function(d) { return "In 2013-14, " + d.level + ", " + formatPercent(d.pct) + " of " + d.group + " students, or " + formatNumber(d.number) + " students, were chronically absent."; });

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

			updateGroups.selectAll("aria-label")
				.text(function(d) { return "In 2013-14, " + formatPercent(d.pct) + " of " + d.level + " school " + d.group + " students, or " + formatNumber(d.number) + " students, were chronically absent."; });

			updateBars.enter()
				.append("rect")
					.attr("class", function(d) { return "bar " + d.level; })
					.attr("x", 0)
					.attr("width", 0)
					.attr("y", function(d, i) { return (yScale0.rangeBand() / 2) - ((.85 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); })
					.attr("height", 0)
					//.style("fill", function(d) { return color(d.level); })
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide)
					.transition()
						.delay(animateTime / 2)
						.duration(animateTime)
						.attr("width", function(d) { return xScale(d.pct); })
						.attr("height", barWidth);

			updateGroups.selectAll("rect.bar")
				.append("aria-label")
					.text(function(d) { return "In 2013-14, " + formatPercent(d.pct) + " of " + d.level + " school " + d.group + " students, or " + formatNumber(d.number) + " students, were chronically absent."; });

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

			width = (parseInt(d3.select("#" + sectionID).style("width"), 10) < 360) ? 360 : parseInt(d3.select("#" + sectionID).style("width"), 10);
			widthAdj = width - marginLeft - margin.right;

			// resize chart

			xScale.range([0, widthAdj - 100]);
			xDomain();
			xAxis.ticks(Math.max((widthAdj - 100)/100, 2))

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

	chart.altText1 = function(value) {

		if (!arguments.length) return altText1;
		altText1 = value;
		return chart;

	};

	chart.altText2 = function(value) {

		if (!arguments.length) return altText2;
		altText2 = value;
		return chart;

	};

	chart.altText3 = function(value) {

		if (!arguments.length) return altText3;
		altText3 = value;
		return chart;

	};

	chart.altText4 = function(value) {

		if (!arguments.length) return altText4;
		altText4 = value;
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
