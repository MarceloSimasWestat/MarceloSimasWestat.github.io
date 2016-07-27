// Counter function

function counter() {

	// Options accessible to the caller
	// These are the default values

	var	animateTime = 1000,
		caption = "Fill in caption using .caption().",
		altText = "Fill in alt text using .altText().",
		containerID = [],
		subcontainerID = [],
		chartID = [],
		sectionID = [],
		data = [];

	function chart(selection) {
		selection.each(function() {

		// formats

		var	formatNumber = d3.format(",f"),
			formatPercent = d3.format(",%");

		// First half

		var counterDiv = d3.select("#counter");

		counterDiv.append("div")
			.style("text-align", "left")
			.html("<h2 id='overCount'>OVER </h2>");

		counterDiv.append("div")
			.html("<hr style='opacity: 0'>");

		/* Second half */

		var counterDiv2 = counterDiv.append("div")
			.style("text-align", "left")
			.style("display", "table-row");

		counterDiv2.append("div")
			.style("width", "200px")
			.style("height", "200px")
			.style("display", "inline-block")
			.append("div")
				.attr("id", "cd2_left")
				.style("width", "200px")
				.style("height", "200px")
				.style("display", "table-row");

		counterDiv2.append("div")
			.style("width", "70%")
			.style("height", "200px")
			.style("display", "inline-block")
			.style("margin-left", "20px")
			.append("div")
				.attr("id", "cd2_right")
				.style("width", "200px")
				.style("height", "200px")
				.style("display", "table-row");

		var donut = d3.select("#cd2_left")
			.append("div")
				.attr("id", "donut")
				.attr("overflow", "hidden")
				.style("display", "table-cell")
				.style("vertical-align", "middle")
				.style("width", "200px")
				.style("height", "200px")
				//.style("display", "inline-block");

		var width = parseInt(d3.select("#donut").style("width"), 10),
			height = width;

		var margin = {top: 0, right: 20, bottom: 0, left: 0},
			widthAdj = width - margin.right - margin.left,
			heightAdj = height - margin.top - margin.bottom;

		var svg = donut.append("svg")
			.attr("class", "donut")
				.attr("width", width)
				.attr("height", height)
				.attr("aria-label", altText)
				.append("g")
					.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		var radius = Math.min(widthAdj/2, heightAdj/2);

		var arc = d3.svg.arc()
			.outerRadius(radius - 0)
			.innerRadius(radius/1.5)
			.startAngle(function(d) { return d.startAngle + Math.PI*2;	})
			.endAngle(function(d) { return d.endAngle + Math.PI*2; });

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { return d.overall_p; });

		var arc1 = d3.svg.arc()
			.outerRadius(radius - 0)
			.innerRadius(radius/1.5);

		// draw arcs

		var donutText = d3.select("#cd2_right")
			.append("div")
			.data(data)
				.attr("id", "donutText")
				.style("display", "table-cell")
				.style("vertical-align", "middle")
				.style("margin-left", "20px")
				.style("width", "70%")
				.style("height", "200px")
				.style("text-align", "left")
				.style("opacity", 0)
				//.style("display", "inline-block");

		donutText.append("text")
			.html("<p style='font-size: 19px;'>Among those,</p><h2></h2>");

		donutText.select("h2")
			.append("text")
			.text(function(d) { return formatPercent(d.overall_p) + " were black male students."});

		// counter function

		var counterValue = 0;

		counterDiv.select("h2")
			.append("text")
				.text(counterValue);

		$("#overCount").append("<br><span>students received out-of-school suspensions in 2013-14.</span>");

		function countUp(text, duration) {
			text.transition()
				.duration(duration)
				.ease("linear")
				.tween("text", function() {

					var	formatNumber = d3.format(",f");
					var i = d3.interpolate(counterValue, 2500000);

					return function(t) {
						d3.select(this).text(formatNumber(i(t)));
						counterValue = i(t);
					};

				})
				.each("end", function() {
					counterDiv.select("hr")
						.transition()
							.duration(animateTime)
							.style("opacity", 1)
							.each("end", function() {

								svg.append("circle")
									.attr("r", radius)
									.attr("stroke", "white")
									.attr("stroke-width", "1.5px")
									.attr("fill", "none")
									.style("opacity", 0);

								svg.append("circle")
									.attr("r", radius/1.5)
									.attr("stroke", "white")
									.attr("stroke-width", "1.5px")
									.attr("fill", "none")
									.style("opacity", 0);

								svg.selectAll("circle")
									.transition()
										.duration(animateTime)
										.style("opacity", 1)
										.each("end", function(d) {
											svg.selectAll(".arc")
												.data(pie(data))
												.enter()
													.append("g")
														.attr("class", function(d, i) { return "arc segment" + i; })
														.append("path")
															.transition()
																.duration(animateTime)
																.delay(function(d, i) { return i * animateTime; })
																.attrTween("d", function(d) {

																	var i = d3.interpolate(d.startAngle, d.endAngle);
																	return function(t) { d.endAngle = i(t); return arc(d); }

																})
																.each("end", function() {

																	d3.select("#donutText")
																		.transition()
																			.duration(animateTime)
																			.style("opacity", 1);
																});
										});
							});
					});
		};

		// activate on scroll

		var gs = graphScroll()
			.container(d3.select("#intro_chart"))
			.graph(d3.selectAll("#counter"))
			.sections(d3.selectAll("#intro_sections > div"))
			.on("active", function() {

				if (document.getElementById("counter_pre").className.indexOf("activated") >= 0) { return; }
				else if (document.getElementById("counter_pre").className.indexOf("graph-scroll") >= 0) {

				d3.select("#counter")
					.classed("activated", "true");

				d3.select("#counter > div > h2")
					.selectAll("text")
					.call(countUp, 2.5 * animateTime);

			}});


		});

	};

	chart.animateTime = function(value) {

		if (!arguments.length) return animateTime;
		animateTime = value;
		return chart;

	};

	chart.caption = function(value) {

		if (!arguments.length) return caption;
		caption = value;
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

// Bar chart function

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

		var svg = dom.append("svg")
			.attr("class", "bar-chart")
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

		svg.append("aria-label")
			.text(altText);

		// tooltips using d3-tip

		var tipBar = d3.tip()
			.attr("class", "d3-tip")
			.direction("e")
			.offset([0, 10])
			.html(function(d) {

			return formatPercent(d.overall_p) + " (" + formatNumber(d.overall_n) + " students)";


		});

		svg.call(tipBar);

		// axis scales

		var xScale = d3.scale.linear().range([0, widthAdj]),
			yScale = d3.scale.ordinal().range([heightAdj, 0]).rangeRoundBands([0, heightAdj], 0.5);

		// domains

		function xDomain() {
			if (window.innerWidth <= 736) { xScale.domain([0, d3.max(data, function(d) { return d.overall_p; })]).nice() }
			else { xScale.domain([0, 0.25]); }
		};
		xDomain();
		yScale.domain(data.map(function(d) { return d.group; }));

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
			.text("% SUSPENDED IN 2013-14")

		// draw bars

		var bars = svg.selectAll("rect.bar")
			.data(data);

		bars.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("rect")
					.attr("class", function(d) {
						if (d.group == "Overall") { return "overallBar"; }
						else { return "bar"; }
					})
					.attr("x", 0)
					.attr("width", 0)
					.attr("y", function(d) { return yScale(d.group) + (yScale.rangeBand() / 2) - (barWidth/2); })
					.attr("height", barWidth)
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide)
					.append("aria-label")
						.text(function(d) { return "In 2013-14, " + formatPercent(d.overall_p) + " of " + d.group + " students, or " + formatNumber(d.overall_n) + " students, received one or more out-of-school suspensions."; });

		var gs = graphScroll()
			.container(d3.select("#" + containerID))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#" + subcontainerID + " > div"))
			.on("active", function() {

				if (document.getElementById(sectionID).className.indexOf("activated") >= 0) { return; }
				else if (document.getElementById(sectionID).className.indexOf("graph-scroll") >= 0) {

					d3.select("#" + sectionID)
						.classed("activated", "true");

					svg.selectAll("rect")
						.transition()
						.duration(animateTime)
						.attr("width", function(d) { return xScale(d.overall_p); });

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

			d3.select("#" + sectionID)
				.classed("activated", null)

			dom.selectAll(".bar-chart")
				.attr("width", width);

			svg.select(".x.axis")
				.call(xAxis);

			svg.select("text.x.axis")
				.attr("x", widthAdj)
				.attr("dx", "0.5em");

			svg.selectAll("rect")
				.attr("width", 0);

			var gs2 = graphScroll()
			.container(d3.select("#" + containerID))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#" + subcontainerID + " > div"))
			.on("active", function() {

				if (document.getElementById(sectionID).className.indexOf("activated") >= 0) { return; }
				else if (document.getElementById(sectionID).className.indexOf("graph-scroll") >= 0) {

					d3.select("#" + sectionID)
						.classed("activated", "true");

					svg.selectAll("rect")
						.transition()
						.duration(animateTime)
						.attr("width", function(d) { return xScale(d.overall_p); });

			}});

		});

		});

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

	chart.caption = function(value) {

		if (!arguments.length) return caption;
		caption = value;
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

// Column chart with three tabs function

function columnThree() {

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

		// filter data to show gender by default

		var subchartID = 1;

		dataFiltered = data.filter(function(d) { return d.subchart == subchartID; });

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
			.text("Gender")
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
			.text("Disability Status")
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
			.text("English Learner Status")
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
			.append("p");

		// chart title

		d3.select(this).append("div")
			.attr("id", "title" + chartID)
			.style("margin", "0 auto")
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
			.style("max-width", maxWidth + "px");

		var svg = dom.append("svg")
			.attr("class", "col-chart")
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

		svg.append("aria-label")
			.text(altText1);

		// tooltips using d3-tip

		var tipCol = d3.tip()
			.attr("class", "d3-tip")
			.offset([-10, 0])
			.html(function(d) {

			return formatPercent(d.overall_p) + " (" + formatNumber(d.overall_n) + " students)";


		});

		svg.call(tipCol);

		// axis scales

		var xScale = d3.scale.ordinal().rangeRoundBands([0, widthAdj], .5),
			yScale = d3.scale.linear().range([heightAdj, 0]);

		// domains

		xScale.domain(dataFiltered.map(function(d) { return d.group; }));
		yScale.domain([0, 0.25]);

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
			.text("% SUSPENDED IN 2013-14");

		// draw columns

		var cols = svg.selectAll("rect.column")
			.data(dataFiltered);

		cols.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("rect")
					.attr("class", function(d) {
						if (d.group == "Overall") { return "overallColumn"; }
						else { return "column"; }
					})
					.attr("x", function(d, i) { return xScale(d.group) + (xScale.rangeBand() / 2) - (colWidth / 2); })
					.attr("width", colWidth)
					.attr("y", heightAdj)
					.attr("height", 0)
					.on("mouseover", tipCol.show)
					.on("mouseout", tipCol.hide)
					.append("aria-label")
						.text(function(d) { return "In 2013-14, " + formatPercent(d.overall_p) + " of " + d.group + " students, or " + formatNumber(d.overall_n) + " students, received one or more out-of-school suspensions."; });

		var gs = graphScroll()
			.container(d3.select("#" + containerID))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#" + subcontainerID + " > div"))
			.on("active", function() {

				if (document.getElementById(sectionID).className.indexOf("activated") >= 0) { return; }
				else if (document.getElementById(sectionID).className.indexOf("graph-scroll") >= 0) {

					d3.select("#" + sectionID)
						.classed("activated", "true");

					svg.selectAll("rect")
						.transition()
							.duration(animateTime)
							.attr("height", function(d) { return heightAdj - yScale(d.overall_p); })
							.attr("y", function(d) { return yScale(d.overall_p); });

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

			dataFiltered = data.filter(function(d) { return d.subchart == subchartID; });

			// update scales

			xScale.domain(dataFiltered.map(function(d) { return d.group; }));
			yScale.domain([0, 0.25]);

			// update columns

			var updateCols = svg.selectAll("rect")
				.data(dataFiltered);

			updateCols.transition()
				.duration(animateTime)
				.attr("x", function(d, i) { return xScale(d.group) + (xScale.rangeBand() / 2) - (colWidth / 2); })
				.attr("width", colWidth)
				.attr("height", function(d) { return heightAdj - yScale(d.overall_p); })
				.attr("y", function(d) { return yScale(d.overall_p); });

			updateCols.select("aria-label")
				.text(function(d) { return "In 2013-14, " + formatPercent(d.overall_p) + " of " + d.group + " students, or " + formatNumber(d.overall_n) + " students, received one or more out-of-school suspensions."; });

			updateCols.enter()
				.append("g")
					.attr("transform", "translate(0,0)")
					.append("rect")
						.attr("class", function(d) {
							if (d.group == "Overall") { return "overallColumn"; }
							else { return "column"; }
						})
						.attr("x", function(d, i) { return xScale(d.group) + (xScale.rangeBand() / 2) - (colWidth / 2); })
						.attr("width", colWidth)
						.attr("y", heightAdj)
						.attr("height", 0)
						.on("mouseover", tipCol.show)
						.on("mouseout", tipCol.hide)
						.transition()
							.duration(animateTime)
							.attr("height", function(d) { return heightAdj - yScale(d.overall_p); })
							.attr("y", function(d) { return yScale(d.overall_p); });

			updateCols.select("rect")
				.append("aria-label")
					.text(function(d) { return "In 2013-14, " + formatPercent(d.overall_p) + " of " + d.group + " students, or " + formatNumber(d.overall_n) + " students, received one or more out-of-school suspensions."; });

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
				.remove();

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + heightAdj + ")")
				.style("opacity", 1)
				.attr("aria-hidden", "true")
				.call(xAxis)
				.selectAll(".tick text")
					.call(wrap, xScale.rangeBand());

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
			yScale.domain([0, 0.25]);
			yAxis.scale(yScale).tickSize(-1 * widthAdj).ticks(Math.max(heightAdj/100, 2));

			d3.select("#" + sectionID)
				.classed("activated", null);

			dom.selectAll(".col-chart")
				.attr("width", width)
				.attr("height", height);

			svg.select(".x.axis")
				.attr("transform", "translate(0," + heightAdj + ")")
				.call(xAxis)
				.selectAll(".tick text")
					.call(wrap, xScale.rangeBand());

			svg.select(".y.axis")
				.call(yAxis);

			svg.selectAll("rect.column")
				.attr("x", function(d, i) { return xScale(d.group) + (xScale.rangeBand() / 2) - (colWidth / 2); })
				.attr("height", 0)
				.attr("y", heightAdj);

			svg.selectAll("rect.overallColumn")
				.attr("x", function(d, i) { return xScale(d.group) + (xScale.rangeBand() / 2) - (colWidth / 2); })
				.attr("height", 0)
				.attr("y", heightAdj);

			var gs2 = graphScroll()
				.container(d3.select("#" + containerID))
				.graph(d3.selectAll("#" + chartID))
				.sections(d3.selectAll("#" + subcontainerID + " > div"))
				.on("active", function() {

					if (document.getElementById(sectionID).className.indexOf("activated") >= 0) { return; }
					else if (document.getElementById(sectionID).className.indexOf("graph-scroll") >= 0) {

						d3.select("#" + sectionID)
							.classed("activated", "true");

						svg.selectAll("rect")
							.transition()
								.duration(animateTime)
								.attr("height", function(d) { return heightAdj - yScale(d.overall_p); })
								.attr("y", function(d) { return yScale(d.overall_p); });

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

// Dot plot (two dots) function

function dotTwo() {

	// Options accessible to the caller
	// These are the default values

	var	width = [],
		height = 500,
		marginTop = 20,
		marginLeft = 100,
		marginBottom = 45,
		dotSize = 4,
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
			formatNumberD = d3.format(",.1f"),
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

		var svg = dom.append("svg")
			.attr("class", "dotPlot")
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

		svg.append("aria-label")
			.text(altText);

		// tooltips using d3-tip

		var tipMale = d3.tip()
			.attr("class", "d3-tip")
			.direction(function(d) {
				if (d.male_p > d.female_p) { return "e"; }
				else { return "w"; }
			})
			.offset([0, 10])
			.html(function(d) {

			return "Male: " + formatPercent(d.male_p) + " (" + formatNumber(d.male_n) + " students)";

		});

		var tipFemale = d3.tip()
			.attr("class", "d3-tip")
			.direction(function(d) {
				if (d.female_p > d.male_p) { return "e"; }
				else { return "w"; }
			})
			.offset([0, -10])
			.html(function(d) {

			return "Female: " + formatPercent(d.female_p) + " (" + formatNumber(d.female_n) + " students)";

		});

		var tipLine = d3.tip()
			.attr("class", "d3-tip")
			.direction("n")
			.offset([-10, 0])
			.html(function(d) {

			return "Difference: " + formatNumberD(d.diff_ppt) + " percentage points";

		});

		svg.call(tipMale);
		svg.call(tipFemale);
		svg.call(tipLine);

		// axis scales and axes

		var xScale = d3.scale.linear().range([0, widthAdj]),
			yScale = d3.scale.ordinal().rangeRoundBands([0, heightAdj], .1);

		// domains
		// identify maximum value across male and female percentages

		var maxMale = d3.max(data, function(d) { return d.male_p; });
		var maxFemale = d3.max(data, function(d) { return d.female_p; });
		var maxValue;

		function maxVal() {
			if (maxMale > maxFemale) { maxValue = maxMale; }
			else { maxValue = maxFemale; }
		};

		maxVal();

		function xDomain() {
			if (window.innerWidth <= 736) { xScale.domain([0, maxValue]).nice() }
			else { xScale.domain([0, 0.25]); }
		};
		xDomain();
		yScale.domain(data.map(function(d) { return d.group; }));

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
			.text("% SUSPENDED IN 2013-14");

		// draw dots and lines

		var lines = svg.selectAll("line.dotL")
			.data(data);

		lines.enter()
			.append("g")
			.attr("transform", "translate(0,0)")
			.append("line")
				.attr("class", "dotL")
				.attr("x1", function(d) { return xScale((d.male_p + d.female_p)/2); })
				.attr("x2", function(d) { return xScale((d.male_p + d.female_p)/2); })
				.attr("y1", function(d) { return yScale(d.group) + (yScale.rangeBand() / 2); })
				.attr("y2", function(d) { return yScale(d.group) + (yScale.rangeBand() / 2); });

		lines.enter()
			.append("g")
			.attr("transform", "translate(0,0)")
			.append("line")
				.attr("class", "dotLHit")
				.attr("x1", function(d) { return xScale((d.male_p + d.female_p)/2); })
				.attr("x2", function(d) { return xScale((d.male_p + d.female_p)/2); })
				.attr("y1", function(d) { return yScale(d.group) + (yScale.rangeBand() / 2); })
				.attr("y2", function(d) { return yScale(d.group) + (yScale.rangeBand() / 2); })
				.on("mouseover", tipLine.show)
				.on("mouseout", tipLine.hide);

		var dotsMale = svg.selectAll("circle.dotM")
			.data(data);

		dotsMale.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("circle")
					.attr("class", "dotM")
					.attr("clip-path", function() { return "url(#clip" + chartID + ")"; })
					.attr("cx", 0)
					.attr("cy", function(d) { return yScale(d.group) + (yScale.rangeBand() / 2); })
					.attr("r", dotSize/2)
					.on("mouseover", tipMale.show)
					.on("mouseout", tipMale.hide)
					.append("aria-label")
						.text(function(d) { return "In 2013-14, " + formatPercent(d.male_p) + " of male " + d.group + " students, or " + formatNumber(d.male_n) + " students, received one or more out-of-school suspensions."; });

		dotsMale.append("text")
			.attr("x", function(d) { return xScale(d.male_p); })
			.attr("y", function(d) { return yScale(d.group) + (yScale.rangeBand() / 2); })
			.attr("dy", (-2.5 * dotSize))
			.attr("text-anchor", "middle")
			.attr("class", "labelM")
			.attr("aria-hidden", "true")
			.style("opacity", 0)
			.text("MALE");

		var dotsFemale = svg.selectAll("circle.dotF")
			.data(data);

		dotsFemale.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("circle")
					.attr("class", "dotF")
					.attr("clip-path", function() { return "url(#clip" + chartID + ")"; })
					.attr("cx", 0)
					.attr("cy", function(d) { return yScale(d.group) + (yScale.rangeBand() / 2); })
					.attr("r", dotSize/2)
					.on("mouseover", tipFemale.show)
					.on("mouseout", tipFemale.hide)
					.append("aria-label")
						.text(function(d) { return "In 2013-14, " + formatPercent(d.female_p) + " of male " + d.group + " students, or " + formatNumber(d.female_n) + " students, received one or more out-of-school suspensions."; });

		dotsFemale.append("text")
			.attr("x", function(d) { return xScale(d.female_p); })
			.attr("y", function(d) { return yScale(d.group) + (yScale.rangeBand() / 2); })
			.attr("dy", (-2.5 * dotSize))
			.attr("text-anchor", "middle")
			.attr("aria-hidden", "true")
			.attr("class", "labelF")
			.style("opacity", 0)
			.text("FEMALE");

		var gs = graphScroll()
			.container(d3.select("#" + containerID))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#" + subcontainerID + " > div"))
			.on("active", function() {

				if (document.getElementById(sectionID).className.indexOf("activated") >= 0) { return; }
				else if (document.getElementById(sectionID).className.indexOf("graph-scroll") >= 0) {

					d3.select("#" + sectionID)
						.classed("activated", "true");

					svg.selectAll("line.dotL")
						.transition()
							.duration(animateTime)
							.delay(animateTime)
							.attr("x1", function(d) {
								if (d.female_p > d.male_p) { return xScale(d.male_p) + dotSize; }
								else { return xScale(d.female_p) + dotSize; }
							})
							.attr("x2", function(d) {
								if (d.female_p > d.male_p) { return xScale(d.female_p) - dotSize; }
								else { return xScale(d.male_p) - dotSize; }
							});

					svg.selectAll("line.dotLHit")
						.transition()
							.duration(animateTime)
							.delay(animateTime)
							.attr("x1", function(d) {
								if (d.female_p > d.male_p) { return xScale(d.male_p) + dotSize; }
								else { return xScale(d.female_p) + dotSize; }
							})
							.attr("x2", function(d) {
								if (d.female_p > d.male_p) { return xScale(d.female_p) - dotSize; }
								else { return xScale(d.male_p) - dotSize; }
							});

					svg.selectAll("circle.dotM")
						.transition()
							.duration(animateTime)
							.attr("cx", function(d) { return xScale(d.male_p); })
							.each("end", function(d) {
								d3.select(this)
									.transition()
										.duration(animateTime)
										.attr("r", dotSize);
							});

					svg.selectAll("text.labelM")
						.transition()
							.duration(animateTime)
							.delay(animateTime)
							.style("opacity", function(d) {
								if (d.group == "Overall") { return 1; }
								else { return 0; }
							});

					svg.selectAll("circle.dotF")
						.transition()
							.duration(animateTime)
							.attr("cx", function(d) { return xScale(d.female_p); })
							.each("end", function(d) {
								d3.select(this)
									.transition()
										.duration(animateTime)
										.attr("r", dotSize);
							});

					svg.selectAll("text.labelF")
						.transition()
							.duration(animateTime)
							.delay(animateTime)
							.style("opacity", function(d) {
								if (d.group == "Overall") { return 1; }
								else { return 0; }
							});

			}});

		// add clip path

		svg.append("defs")
			.append("clipPath")
				.attr("id", function() { return "clip" + chartID; })
					.append("rect")
						.attr("id", function() { return "clipRect" + chartID; })
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

			d3.select("#" + sectionID)
				.classed("activated", null);

			d3.select("#clipRect" + chartID)
				.attr("width", widthAdj + margin.right)
				.attr("height", heightAdj);

			svg.select(".x.axis")
				.call(xAxis);

			svg.select("text.x.axis")
				.attr("x", widthAdj)
				.attr("dx", "0.5em");

			svg.selectAll("line.dotL")
				.attr("x1", function(d) { return xScale((d.male_p + d.female_p)/2); })
				.attr("x2", function(d) { return xScale((d.male_p + d.female_p)/2); });

			svg.selectAll("line.dotLHit")
				.attr("x1", function(d) { return xScale((d.male_p + d.female_p)/2); })
				.attr("x2", function(d) { return xScale((d.male_p + d.female_p)/2); });

			svg.selectAll("circle.dotM")
				.attr("clip-path", function() { return "url(#clip" + chartID + ")"; })
				.attr("cx", 0);

			svg.selectAll("text.labelM")
				.attr("x", function(d) { return xScale(d.male_p); })
				.style("opacity", 0);

			svg.selectAll("circle.dotF")
				.attr("clip-path", function() { return "url(#clip" + chartID + ")"; })
				.attr("cx", 0);

			svg.selectAll("text.labelF")
				.attr("x", function(d) { return xScale(d.female_p); })
				.style("opacity", 0);

			var gsResize = graphScroll()
				.container(d3.select("#" + containerID))
				.graph(d3.selectAll("#" + chartID))
				.sections(d3.selectAll("#" + subcontainerID + " > div"))
				.on("active", function() {

					if (document.getElementById(sectionID).className.indexOf("activated") >= 0) { return; }
					else if (document.getElementById(sectionID).className.indexOf("graph-scroll") >= 0) {

						d3.select("#" + sectionID)
							.classed("activated", "true");

						svg.selectAll("line.dotL")
							.transition()
								.duration(animateTime)
								.delay(animateTime)
								.attr("x1", function(d) {
									if (d.female_p > d.male_p) { return xScale(d.male_p) + dotSize; }
									else { return xScale(d.female_p) + dotSize; }
								})
								.attr("x2", function(d) {
									if (d.female_p > d.male_p) { return xScale(d.female_p) - dotSize; }
									else { return xScale(d.male_p) - dotSize; }
								});

						svg.selectAll("line.dotLHit")
							.transition()
								.duration(animateTime)
								.delay(animateTime)
								.attr("x1", function(d) {
									if (d.female_p > d.male_p) { return xScale(d.male_p) + dotSize; }
									else { return xScale(d.female_p) + dotSize; }
								})
								.attr("x2", function(d) {
									if (d.female_p > d.male_p) { return xScale(d.female_p) - dotSize; }
									else { return xScale(d.male_p) - dotSize; }
								});

						svg.selectAll("circle.dotM")
							.transition()
								.duration(animateTime)
								.attr("cx", function(d) { return xScale(d.male_p); })
								.each("end", function(d) {
									d3.select(this)
										.transition()
											.duration(animateTime)
											.attr("r", dotSize);
								});

						svg.selectAll("text.labelM")
						.transition()
							.duration(animateTime)
							.delay(animateTime)
							.style("opacity", function(d) {
								if (d.group == "Overall") { return 1; }
								else { return 0; }
							});

						svg.selectAll("circle.dotF")
							.transition()
								.duration(animateTime)
								.attr("cx", function(d) { return xScale(d.female_p); })
								.each("end", function(d) {
									d3.select(this)
										.transition()
											.duration(animateTime)
											.attr("r", dotSize);
								});

					svg.selectAll("text.labelF")
						.transition()
							.duration(animateTime)
							.delay(animateTime)
							.style("opacity", function(d) {
								if (d.group == "Overall") { return 1; }
								else { return 0; }
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

// Grouped bar chart function

function groupedBar() {

	// Options accessible to the caller
	// These are the default values

	var	width = [],
		height = 650,
		marginTop = 20,
		marginLeft = 100,
		marginBottom = 60,
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
			formatNumberD = d3.format(",.1f"),
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

		var svg = dom.append("svg")
			.attr("class", "groupedBar")
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

		svg.append("aria-label")
			.text(altText1);

		// tooltips using d3-tip

		var tipBar = d3.tip()
			.attr("class", "d3-tip")
			.direction("e")
			.offset([0, 10])
			.html(function(d) {
				return d.level + "</br>" + formatPercent(d.overall_p) + " (" + formatNumber(d.overall_n) + " students)";
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

		var levels = ["Enrolled","Suspended"];

		function xDomain() {
			if (window.innerWidth <= 736) {

				xScale.domain([0, d3.max(data, function(d) { return d.overall_p; })]).nice()

			}
			/*else { xScale.domain([0, 0.5]); }*/
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
			.attr("id", "xAxisT_a")
			.attr("class", "x axis")
			.attr("x", widthAdj - 100)
			.attr("dx", ".5em")
			.attr("y", heightAdj)
			.attr("dy", "3.1em")
			.attr("text-anchor", "end")
			.attr("aria-hidden", "true")
			.text(function() { 
				if (window.innerWidth <= 736) { return "% ENROLLED VS. % OF"; }
				else { return "% OF ENROLLED VS. % OF SUSPENDED IN 2013-14"; }
			});
			
		svg.append("text")
			.attr("id", "xAxisT_b")
			.attr("class", "x axis")
			.attr("x", widthAdj - 100)
			.attr("dx", ".5em")
			.attr("y", heightAdj)
			.attr("dy", "4.1em")
			.attr("text-anchor", "end")
			.attr("aria-hidden", "true")
			.style("opacity", function() {
				if (window.innerWidth <= 736) { return 1; }
				else { return 0; }
			})
			.text("SUSPENDED IN 2013-14");	

		// draw national bars

	/*	data_national = dataFiltered.filter(function(d) { return d.level == "Overall"; });

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
						.text(function(d) { return "In 2013-14, " + d.level + ", " + formatPercent(d.pct) + " of " + d.group + " students, or " + formatNumber(d.number) + " students, were chronically absent."; }); */

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
					.text(function(d) {
						if (d.level == "Enrolled") { return "In 2013-14, " + d.group + " students comprised " + formatPercent(d.overall_p) + " of the total students enrolled in pre-school."; }
						else if (d.level == "Suspended") { return "In 2013-14, " + d.group + " students comprised " + formatPercent(d.overall_p) + " of the total pre-school students receiving one or more out-of-school suspensions."; }
					});

		var gs = graphScroll()
			.container(d3.select("#" + containerID))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#" + subcontainerID + " > div"))
			.on("active", function() {

				if (document.getElementById(sectionID).className.indexOf("activated") >= 0) { return; }
				else if (document.getElementById(sectionID).className.indexOf("graph-scroll") >= 0) {

					d3.select("#" + sectionID)
						.classed("activated", "true");

					/*svg.selectAll(".national-bar")
						.transition()
							.duration(animateTime)
							.attr("width", function(d) { return xScale(d.overall_p); });*/

					svg.selectAll(".bar")
						.transition()
							.duration(animateTime)
							.attr("width", function(d) { return xScale(d.overall_p); })
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
			.data(levels)
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

			/*data_national = dataFiltered.filter(function(d) { return d.level == "Overall"; });

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
					.remove();*/

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
				.text(function(d) { return "In 2013-14, " + formatPercent(d.overall_p) + " of " + d.level + " school " + d.group + " students, or " + formatNumber(d.overall_n) + " students, received one or more out-of-school suspensions."; });

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
						.duration(animateTime)
						.attr("width", function(d) { return xScale(d.overall_p); })
						.attr("height", barWidth);

			updateGroups.selectAll("rect.bar")
				.append("aria-label")
					.text(function(d) {
						if (d.level == "Enrolled") { return "In 2013-14, " + d.group + " students comprised " + formatPercent(d.overall_p) + " of the total students enrolled in pre-school."; }
						else if (d.level == "Suspended") { return "In 2013-14, " + d.group + " students comprised " + formatPercent(d.overall_p) + " of the total pre-school students receiving one or more out-of-school suspensions."; }
					});

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

			d3.select("#" + sectionID)
				.classed("activated", null);

			dom.selectAll(".groupedBar")
				.attr("width", width);

			svg.select(".x.axis")
				.call(xAxis);

			svg.selectAll("text.x.axis")
				.attr("x", widthAdj - 100)
				.attr("dx", "0.5em");

			svg.select("#xAxisT_a")
				.text(function() { 
					if (window.innerWidth <= 736) { return "% OF ENROLLED VS. % OF"; }
					else { return "% OF ENROLLED VS. % OF SUSPENDED IN 2013-14"; }
				});
				
			svg.select("#xAxisT_b")
				.style("opacity", function() {
					if (window.innerWidth <= 736) { return 1; }
					else { return 0; }
				})
				.text("SUSPENDED IN 2013-14");					
				
			/*dom.selectAll(".national-bar")
				.attr("width", 0);*/

			svg.selectAll(".bar")
				.attr("width", 0);

			var gsResize = graphScroll()
				.container(d3.select("#" + containerID))
				.graph(d3.selectAll("#" + chartID))
				.sections(d3.selectAll("#" + subcontainerID + " > div"))
				.on("active", function() {

					if (document.getElementById(sectionID).className.indexOf("activated") >= 0) { return; }
					else if (document.getElementById(sectionID).className.indexOf("graph-scroll") >= 0) {

						d3.select("#" + sectionID)
							.classed("activated", "true");

						/*svg.selectAll(".national-bar")
							.transition()
								.duration(animateTime)
								.attr("width", function(d) { return xScale(d.pct); }); */

						svg.selectAll(".bar")
							.transition()
								.duration(animateTime)
								.attr("width", function(d) { return xScale(d.overall_p); })
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

// Grouped bar (diverging)

function groupedBarDiv() {

	// Options accessible to the caller
	// These are the default values

	var	width = [],
		height = 650,
		marginTop = 35,
		marginLeft = 100,
		marginBottom = 60,
		animateTime = 1000,
		barWidth = 15,
		title = "Generic chart title. Update me using .title()!",
		altText = "Fill in alt text for screen readers! Use .altText().",
		containerID = [],
		subcontainerID = [],
		chartID = [],
		sectionID = [],
		data = [];

	function chart(selection) {
		selection.each(function() {

		// formats

		var	formatNumber = d3.format(",f"),
			formatNumberD = d3.format(",.1f"),
			formatPercent = d3.format(",.1%");

		// margins; adjust width and height to account for margins

		width = (parseInt(d3.select("#" + sectionID).style("width"), 10) < 360) ? 360 : parseInt(d3.select("#" + sectionID).style("width"), 10);

		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// chart title

		d3.select(this).append("div")
			.attr("id", "title" + chartID)
			.html("<span class = 'title'>" + title + "</span>");

		// selections

		var dom = d3.select(this)
			.append("div")
			.attr("id", chartID);

			var svg = dom.append("svg")
			.attr("class", "groupedBarDiv")
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

		svg.append("aria-label")
			.text(altText);

		// tooltips using d3-tip

		var tipBar = d3.tip()
			.attr("class", "d3-tip")
			.direction("e")
			.offset([0, 10])
			.html(function(d) {
				return d.group + ", " + d.level + "</br>Of Enrolled: " + formatPercent(d.enrolled_p) + "</br>Of Suspended: " + formatPercent(d.suspended_p) + "</br>Difference: " + formatNumberD(d.diff_ppt) + " percentage points";
			});

		svg.call(tipBar);

		// axis scales

		var xScale = d3.scale.linear().range([0, widthAdj - 100]),
			yScale0 = d3.scale.ordinal().rangeRoundBands([0, heightAdj], 0.15),
			yScale1 = d3.scale.ordinal();

		// domains

		data_nest = d3.nest()
			.key(function(d) { return d.group; })
			.entries(data);

		data_levels = d3.nest()
			.key(function(d) { return d.level; })
			.entries(data);

		var levels = ["Female","Male"];

		var maxPos = d3.max(data, function(d) { return d.diff_ppt; });
		var maxNeg = d3.min(data, function(d) { return d.diff_ppt; });
		var maxValue;

		function maxVal() {
			if ((-1 * maxNeg) > maxPos) { maxValue = (-1 * maxNeg); }
			else { maxValue = maxPos; }
		};

		maxVal();

		function xDomain() {
			if (window.innerWidth <= 736) {

				xScale.domain([-1 * maxValue, maxValue]).nice()

			}
			else { xScale.domain([-25, 25]); }
		};
		xDomain();
		yScale0.domain(data_nest.map(function(d) { return d.key; }));
		yScale1.domain(levels).rangeRoundBands([0, yScale0.rangeBand()], 0.15);

		// axes

		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(-1 * heightAdj).ticks(Math.max((widthAdj - 100)/100, 2)),
			yAxis = d3.svg.axis().scale(yScale0).orient("left").outerTickSize(0);

		// draw x-axis below bars

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.attr("aria-hidden", "true")
			.call(xAxis)

		svg.append("text")
			.attr("id", "xAxisT1")
			.attr("class", "x axis")
			.attr("x", widthAdj - 100)
			.attr("dx", ".5em")
			.attr("y", heightAdj)
			.attr("dy", "3.1em")
			.attr("text-anchor", "end")
			.attr("aria-hidden", "true")
			.text(function() { 
				if (window.innerWidth <= 736) { return "DIFFERENCE BETWEEN % OF SUSPENDED"; }
				else { return "DIFFERENCE BETWEEN % OF SUSPENDED VS. % OF ENROLLED IN 2013-14"; }
			});
			
		svg.append("text")
			.attr("id", "xAxisT2")
			.attr("class", "x axis")
			.attr("x", widthAdj - 100)
			.attr("dx", ".5em")
			.attr("y", heightAdj)
			.attr("dy", "4.1em")
			.attr("text-anchor", "end")
			.attr("aria-hidden", "true")
			.style("opacity", function() {
				if (window.innerWidth <= 736) { return 1; }
				else { return 0; }
			})
			.text("VS. % OF ENROLLED IN 2013-14");

		// draw national bars

	/*	data_national = dataFiltered.filter(function(d) { return d.level == "Overall"; });

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
						.text(function(d) { return "In 2013-14, " + d.level + ", " + formatPercent(d.pct) + " of " + d.group + " students, or " + formatNumber(d.number) + " students, were chronically absent."; }); */

		// draw level bars

		data_nest_noavg = d3.nest()
			.key(function(d) { return d.group; })
			.entries(data);

		var group = svg.selectAll(".group")
			.data(data_nest_noavg, function(d) { return d.key; });

		group.enter()
			.append("g")
				.attr("class", "group")
				.attr("transform", function(d) { return "translate(0," + yScale0(d.key) + ")"; });

		var levelBars = group.selectAll("rect.bar")
			.data(function(d) { return d.values; });

		levelBars.enter()
			.append("rect")
				.attr("class", function(d) { return "bar " + d.level; })
				.attr("x", xScale(0)/*function(d) { return xScale(Math.min(0, d.diff_ppt)); }*/)
				.attr("width", 0)
				.attr("y", function(d, i) { return (yScale0.rangeBand() / 2) - ((.85 * (((1.25 * levels.length) * barWidth)) / 2)) + (1.09 * barWidth * i); })
				.attr("height", 0)
				//.style("fill", function(d) { return color(d.level); })
				.on("mouseover", tipBar.show)
				.on("mouseout", tipBar.hide)
				.append("aria-label")
					.text(function(d) { return "In 2013-14, the difference in the percentage of preschool students who received one or more out-of-school suspensions and percentage of total preschool enrollment for " + d.group + " " + d.level + " students was " + d.diff_ppt + " percentage points."; });

		var gs = graphScroll()
			.container(d3.select("#" + containerID))
			.graph(d3.selectAll("#" + chartID))
			.sections(d3.selectAll("#" + subcontainerID + " > div"))
			.on("active", function() {

				if (document.getElementById(sectionID).className.indexOf("activated") >= 0) { return; }
				else if (document.getElementById(sectionID).className.indexOf("graph-scroll") >= 0) {

					d3.select("#" + sectionID)
						.classed("activated", "true");

					/*svg.selectAll(".national-bar")
						.transition()
							.duration(animateTime)
							.attr("width", function(d) { return xScale(d.overall_p); });*/

					svg.selectAll(".bar")
						.transition()
							.duration(animateTime)
							.attr("x", function(d) { return xScale(Math.min(0, d.diff_ppt)); })
							.attr("width", function(d) { return Math.abs(xScale(d.diff_ppt) - xScale(0)); })
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

		// add 0 line above bars

		svg.append("line")
			.attr("class", "zeroLine")
			.attr("x1", xScale(0))
			.attr("x2", xScale(0))
			.attr("y1", 0)
			.attr("y2", heightAdj);

		// add under/overrepresented text

		svg.append("text")
			.attr("id", "guide1")
			.attr("x", 0)
			.attr("y", 0)
			.attr("dx", "0.5em")
			.attr("dy", "-0.5em")
			.attr("class", "guide")
			.attr("aria-hidden", "true")
			.style("opacity", function() { 
				if (window.innerWidth <= 736) { return 0; }
				else { return 1; }
			})
			.text("< UNDERREPRESENTED");

		svg.append("text")
			.attr("id", "guide2")
			.attr("x", widthAdj - 100)
			.attr("y", 0)
			.attr("dx", "-0.5em")
			.attr("dy", "-0.5em")
			.attr("class", "guide")
			.attr("text-anchor", "end")
			.attr("aria-hidden", "true")
			.style("opacity", function() { 
				if (window.innerWidth <= 736) { return 0; }
				else { return 1; }
			})
			.text("OVERREPRESENTED >");

		// legend

		var legend = svg.selectAll(".legend")
			.data(levels)
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

		// resize

		window.addEventListener("resize", function() {

			// update width

			width = (parseInt(d3.select("#" + sectionID).style("width"), 10) < 360) ? 360 : parseInt(d3.select("#" + sectionID).style("width"), 10);
			widthAdj = width - marginLeft - margin.right;

			// resize chart

			xScale.range([0, widthAdj - 100]);
			maxVal();
			xDomain();
			xAxis.ticks(Math.max((widthAdj - 100)/100, 2))

			/*d3.select("#" + chartID)
				.attr("width", width);*/

			d3.select("#" + sectionID)
				.classed("activated", null);

			dom.selectAll(".groupedBarDiv")
				.attr("width", width);

			svg.select("#guide1")
				.style("opacity", function() { 
					if (window.innerWidth <= 736) { return 0; }
					else { return 1; }
				})

			svg.select("#guide2")
				.style("opacity", function() { 
					if (window.innerWidth <= 736) { return 0; }
					else { return 1; }
				})
				
			svg.select(".x.axis")
				.call(xAxis);

			svg.selectAll("text.x.axis")
				.attr("x", widthAdj - 100)
				.attr("dx", "0.5em");

			svg.select("#xAxisT1")
				.text(function() { 
					if (window.innerWidth <= 736) { return "DIFFERENCE BETWEEN % OF SUSPENDED"; }
					else { return "DIFFERENCE BETWEEN % OF SUSPENDED VS. % ENROLLED IN 2013-14"; }
				});
			
			svg.select("#xAxisT2")
				.style("opacity", function() {
					if (window.innerWidth <= 736) { return 1; }
					else { return 0; }
				});
				
			svg.select("line.zeroLine")
				.attr("x1", xScale(0))
				.attr("x2", xScale(0));

			svg.select("#guide1")
				.attr("x", 0)
				.attr("dx", "0.5em");

			svg.select("#guide2")
				.attr("x", widthAdj - 100)
				.attr("dx", "-0.5em");

			/*dom.selectAll(".national-bar")
				.attr("width", 0);*/

			svg.selectAll(".bar")
				.attr("x", xScale(0))
				.attr("width", 0);

			var gsResize = graphScroll()
				.container(d3.select("#" + containerID))
				.graph(d3.selectAll("#" + chartID))
				.sections(d3.selectAll("#" + subcontainerID + " > div"))
				.on("active", function() {

					if (document.getElementById(sectionID).className.indexOf("activated") >= 0) { return; }
					else if (document.getElementById(sectionID).className.indexOf("graph-scroll") >= 0) {

						d3.select("#" + sectionID)
							.classed("activated", "true");

						/*svg.selectAll(".national-bar")
							.transition()
								.duration(animateTime)
								.attr("width", function(d) { return xScale(d.pct); }); */

						svg.selectAll(".bar")
							.transition()
								.duration(animateTime)
								.attr("x", function(d) { return xScale(Math.min(0, d.diff_ppt)); })
								.attr("width", function(d) { return Math.abs(xScale(d.diff_ppt) - xScale(0)); })
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
