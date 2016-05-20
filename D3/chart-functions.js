// Reusable bar chart function for chronic absenteeism storymap

function barChart() {
	
	// Options accessible to the caller
	// These are the default values
	
	var	width = 960,
		height = 500,
		marginTop = 40,
		marginLeft = 100,
		marginBottom = 20,
		animateTime = 1000,
		title = "Generic chart title. Update me using .title()!",
		data = [];
		
	var updateWidth,
		updateHeight,
		updateMarginTop,
		updateMarginLeft,
		updateMarginBottom,
		updateAnimateTime,
		updateTitle,
		updateData;
		
	function chart(selection) {
		selection.each(function() {
		
		// formats
		
		var	formatNumber = d3.format(",f"),
			formatPercent = d3.format(",.1%");
					
		// margins; adjust width and height to account for margins
	
		var aspect = width/height;
	
		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// selections
				
		var dom = d3.select(this)
			.append("div")
				.style({
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
					});				
						
		var svg = dom.append("svg")
			.attr("class", "bar-chart")
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.style({
				"max-width": width,
				"max-height": height,
				"position": "absolute",
				"top": 0,
				"left": 0,
				"width": "100%",
				"height": "100%"
			})
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
					
		// tooltips using d3-tip
		
		var tipBar = d3.tip()
			.attr("class", "d3-tip-bar")
			.direction("e")	
			.offset([0, 10])
			.html(function(d) {
	
			return formatComma(d.var2) + " (" + formatPercent(d.var3) + ")";
	
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
		
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatValueAxis).tickSize(-1 * heightAdj),
			yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(0);
					
		// draw x-axis below bars
	
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.call(xAxis)
			.selectAll(".tick text")
				.attr("dx", "1em")
				.attr("dy", "-0.5em");
	
		svg.append("text")
			.attr("class", "x axis")
			.attr("x", widthAdj)
			.attr("dx", "1.5em")
			.attr("y", heightAdj)
			.attr("dy", "1.5em")
			.attr("text-anchor", "end")
			.text("(% CHRONICALLY ABSENT IN 2013-14)")
	
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
					.attr("y", function(d) { return yScale(d.var1); })
					.attr("height", yScale.rangeBand())
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide)
					.transition()
						.duration(animateTime)
						.attr("width", function(d) { return xScale(d.var3); })
				
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
		
		// update functions
		
		updateWidth = function() {
			
			svg.attr("width", widthAdj);
			bars.attr("width", function(d) { return xScale(d.var3); });
			
		};
			
		updateHeight = function() {
			
			svg.attr("height", heightAdj);
			bars.attr("y", function(d) { return yScale(d.var1); })
						
		};

		
		updateMarginTop = function() {
			
			heightAdj = width - marginTop - marginBottom;
		
		};
		
		updateMarginLeft = function() {
			
			widthAdj = width - marginLeft - margin.right;
			
		};
		
		updateMarginBottom = function() {
			
			heightAdj = width - marginTop - marginBottom;
			
		};
		
		updateAnimateTime = function() {
			
			bars.transition().duration(animateTime);
		
		};

		updateTitle = function() {
			
			d3.select(".bar-chart title")
				.text(title);
		
		};
		
		updateData = function() {
		
		var xScale = d3.scale.linear().range([0, widthAdj]),	
			yScale = d3.scale.ordinal().range([heightAdj, 0]),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatPercent),
			yAxis = d3.svg.axis().scale(yScale).orient("left");
		
			var update = svg.selectAll("rect.bar")
				.data(data);
				
			update.attr("x", marginLeft)
				.attr("width", function(d) { return xScale(d.var3); })
				.attr("y", function(d) { return yScale(d.var1); })
				.attr("height", yScale.rangeBand())
		
			update.enter()
				.append("rect")
				.attr("class","bar")
				.attr("x", marginLeft)
				.attr("width", function(d) { return xScale(d.var3); })
				.attr("y", function(d) { return yScale(d.var1); })
				.attr("height", yScale.rangeBand());
		
			update.exit()
				.remove();
		
		};
				
	});
	
};
	
    chart.width = function(value) {
	
        if (!arguments.length) return width;
        width = value;
        if (typeof updateWidth === 'function') updateWidth();
        return chart;
		
    };

    chart.height = function(value) {
	
        if (!arguments.length) return height;
        height = value;
        if (typeof updateHeight === 'function') updateHeight();
        return chart;
		
    };

	chart.marginTop = function(value) {
		
		if (!arguments.length) return marginTop;
		marginTop = value;
		if (typeof updateMarginTop === 'function') updateMarginTop();
		return chart;
		
	};
	
	chart.marginLeft = function(value) {
		
		if (!arguments.length) return marginLeft;
		marginLeft = value;
		if (typeof updateMarginLeft === 'function') updateMarginLeft();
		return chart;
		
	};
	
	chart.marginBottom = function(value) {
		
		if (!arguments.length) return marginBottom;
		marginBottom = value;
		if (typeof updateMarginBottom === 'function') updateMarginBottom();
		return chart;
		
	};

	chart.animateTime = function(value) {
		
		if (!arguments.length) return animateTime;
		animateTime = value;
		if (typeof updateAnimateTime === 'function') updateAnimateTime();
		return chart;
		
	};

	chart.title = function(value) {
		
		if (!arguments.length) return title;
		title = value;
		if (typeof updateTitle === 'function') updateTitle();
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

// Reusable bar chart function for chronic absenteeism storymap

function colChart() {
	
	// Options accessible to the caller
	// These are the default values
	
	var	width = 960,
		height = 500,
		marginTop = 60,
		marginLeft = 20,
		marginBottom = 20,
		animateTime = 1000,	
		title = "Generic chart title. Update me using .title()!",
		data = [];
		
	var updateWidth,
		updateHeight,
		updateMarginTop,
		updateMarginLeft,
		updateMarginBottom,
		updateAnimateTime,
		updateTitle,
		updateData;
		
	function chart(selection) {
		selection.each(function() {
		
		// formats
		
		var	formatNumber = d3.format(",f"),
			formatPercent = d3.format(",.1%");
		
		// margins; adjust width and height to account for margins
		
		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;		
		
		// selections
		
		var dom = d3.select(this)
			.append("div")
				.style({
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
					});				
			
		var svg = dom.append("svg")
			.attr("class", "col-chart")
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.style({
				"max-width": width,
				"position": "absolute",
				"top": 0,
				"left": 0,
				"width": "100%",
				"height": "100%"
			})
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
		
		// tooltips using d3-tip
		
		var tipCol = d3.tip()
			.attr("class", "d3-tip-col")
			.offset([-10, 0])
			.html(function(d) {
	
			return formatComma(d.var2) + " (" + formatPercent(d.var3) + ")";
	
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
		
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(0),
			yAxis = d3.svg.axis().scale(yScale).orient("right").tickFormat(formatValueAxis).tickSize(widthAdj);
		
		// draw y-axis under columns
		
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.selectAll("text")
				.attr("x", 5)
				.attr("dy", "-0.5em");
					
		svg.append("text")
			.attr("class", "y axis")
			.attr("x", 0)
			.attr("dx", "2em")
			.attr("y", 0)
			.attr("dy", "-0.5em")
			.attr("text-anchor", "start")
			.text("(% CHRONICALLY ABSENT IN 2013-14)");
		
		// draw columns
		
		var cols = svg.selectAll("rect.column")
			.data(data);
		
		cols.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("rect")
					.attr("class","column")
					.attr("x", function(d, i) { return xScale(d.var1); })
					.attr("width", xScale.rangeBand())
					.attr("y", heightAdj)
					.attr("height", 0)
					.on("mouseover", tipCol.show)
					.on("mouseout", tipCol.hide)
					.transition()
						.duration(animateTime)
						.attr("height", function(d) { return heightAdj - yScale(d.var3); })
						.attr("y", function(d) { return yScale(d.var3); })
		
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
				
		// update functions
		
		updateWidth = function() {
			
			svg.attr("width", widthAdj);
			cols.attr("x", function(d, i) { return xScale(d.var1); })
			cols.attr("width", xScale.rangeBand());
			
		};
			
		updateHeight = function() {
			
			svg.attr("height", heightAdj);
			cols.attr("y", function(d) { return yScale(d.var3); })
			cols.attr("height", function(d) { return heightAdj - yScale(d.var3); });
			
		};

		updateMarginTop = function() {
			
			heightAdj = height - marginTop - marginBottom;
			
		};		
		
		updateMarginLeft = function() {
			
			widthAdj = width - marginLeft - margin.right;
			
		};
		
		updateMarginBottom = function() {
			
			heightAdj = height - marginTop - marginBottom;
			
		};
		
		updateAnimateTime = function() {
			
			cols.transition().duration(animateTime);
		
		};

		updateTitle = function() {
			
			d3.select(".col-chart title")
				.text(title);
		
		};
		
		updateData = function() {
		
			xScale = d3.scale.ordinal().rangeRoundBands([0, widthAdj], .1);
			yScale = d3.scale.linear().range([heightAdj, 0]);
			xAxis = d3.svg.axis().scale(xScale).orient("bottom");
			yAxis = d3.svg.axis().scale(yScale).orient("left");
		
			var update = svg.selectAll("rect.column")
				.data(data);
				
			update.attr("x", function(d, i) { return xScale(d.var1); })
				.attr("width", xScale.rangeBand())
				.attr("y", function(d) { return yScale(d.var3); })
				.attr("height", function(d) { return heightAdj - yScale(d.var3); })
		
			update.enter()
				.append("rect")
				.attr("class","column")
				.attr("x", function(d, i) { return xScale(d.var1); })
				.attr("width", xScale.rangeBand())
				.attr("y", function(d) { return yScale(d.var3); })
				.attr("height", function(d) { return heightAdj - yScale(d.var3); });
		
			update.exit()
				.remove();
		
		};
		
	});
	
};
	
    chart.width = function(value) {
	
        if (!arguments.length) return width;
        width = value;
        if (typeof updateWidth === 'function') updateWidth();
        return chart;
		
    };

    chart.height = function(value) {
	
        if (!arguments.length) return height;
        height = value;
        if (typeof updateHeight === 'function') updateHeight();
        return chart;
		
    };

	chart.marginTop = function(value) {
		
		if (!arguments.length) return marginTop;
		marginTop = value;
		if (typeof updateMarginTop === 'function') updateMarginTop();
		return chart;
		
	};
	
	chart.marginLeft = function(value) {
		
		if (!arguments.length) return marginLeft;
		marginLeft = value;
		if (typeof updateMarginLeft === 'function') updateMarginLeft();
		return chart;
		
	};
	
	chart.marginBottom = function(value) {
		
		if (!arguments.length) return marginBottom;
		marginBottom = value;
		if (typeof updateMarginBottom === 'function') updateMarginBottom();
		return chart;
		
	};

	chart.animateTime = function(value) {
		
		if (!arguments.length) return animateTime;
		animateTime = value;
		if (typeof updateAnimateTime === 'function') updateAnimateTime();
		return chart;
		
	};

	chart.title = function(value) {
		
		if (!arguments.length) return title;
		title = value;
		if (typeof updateTitle === 'function') updateTitle();
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

// Reusable dot plot function for chronic absenteeism story map

function dotPlot() {
	
	// Options accessible to the caller
	// These are the default values
	
	var	width = 960,
		height = 500,
		marginTop = 40,
		marginLeft = 100,
		marginBottom = 20,
		dotSize = 25,
		animateTime = 1000,
		title = "Generic chart title. Update me using .title()!",
		clipName = [],
		data = [];
		
	var updateWidth,
		updateHeight,
		updateMarginTop,
		updateMarginLeft,
		updateMarginBottom,
		updateDotSize,
		updateAnimateTime,
		updateTitle,
		updateClipName,
		updateData;
		
	function chart(selection) {
		selection.each(function() {
		
		// formats
		
		var	formatNumber = d3.format(",f"),
			formatPercent = d3.format(",.1%");
					
		// margins; adjust width and height to account for margins
		
		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// selections
		
		var dom = d3.select(this)
			.append("div")
				.style({
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
					});		
			
		var svg = dom.append("svg")
			.attr("class", "dotPlot")
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.style({
				"max-width": width,
				"position": "absolute",
				"top": 0,
				"left": 0,
				"width": "100%",
				"height": "100%"
				
			})
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
		
		// tooltips using d3-tip
		
		var tipDot = d3.tip()
			.attr("class", "d3-tip-dot")
			.direction("e")	
			.offset([0, 10])
			.html(function(d) {
	
			return formatComma(d.var2) + " (" + formatPercent(d.var3) + ")";
	
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
		
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatValueAxis).tickSize(-1 * heightAdj),
			yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(0);
	
		// draw x-axis first
		
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.call(xAxis)
			.selectAll(".tick text")
				.attr("dx", "1em")
				.attr("dy", "-0.5em");
	
		svg.append("text")
			.attr("class", "x axis")
			.attr("x", widthAdj)
			.attr("dx", "1.5em")
			.attr("y", heightAdj)
			.attr("dy", "1.5em")
			.attr("text-anchor", "end")
			.text("(% CHRONICALLY ABSENT IN 2013-14)");
			
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
				.attr("y2", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
				.transition()
					.duration(animateTime)
					.attr("x2", function(d) { return xScale(d.var3); })
					.each("end", function(d) { 
						d3.select(this)
							.transition()
								.duration(animateTime)
								.attr("x2", function(d) { return xScale(d.var3) - dotSize; });
					});					
				
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
					.on("mouseout", tipDot.hide)
					.transition()
						.duration(animateTime)
						.attr("cx", function(d) { return xScale(d.var3); })
						.each("end", function(d) { 
							d3.select(this)
								.transition()
									.duration(animateTime)
									.attr("r", dotSize);
						});
											
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
		
		// update functions
		
		updateWidth = function() {
			
			svg.attr("width", widthAdj);
			dots.attr("cx", function(d) { return xScale(d.var3); });
			d3.select("#clip.rect").attr("width", widthAdj);
			
		};
			
		updateHeight = function() {
			
			svg.attr("height", heightAdj);
			dots.attr("cy", function(d) { return yScale.rangeBand(); });
			d3.select("#clip.rect").attr("height", heightAdj);
						

		};
		
		updateMarginTop = function() {
			
			heightAdj = width - marginTop - marginBottom;
		
		};		
		
		updateMarginLeft = function() {
			
			widthAdj = width - marginLeft - margin.right;
			
		};

		updateMarginBottom = function() {
			
			heightAdj = width - margin.top - marginBottom;
			
		};
		
		updateDotSize = function() {
			
			dots.attr("r", dotSize);
			
		};
		
		updateAnimateTime = function() {
			
			lines.transition().duration(animateTime);
			dots.transition().duration(animateTime);
		
		};

		updateTitle = function() {
			
			d3.select(".dotPlot title")
				.text(title);
		
		};
		
		updateClipName = function() {
			
			svg.append("defs")
				.append("clipPath")
					.attr("id", function() { return "clip" + clipName; })
						.append("rect")
							.attr("width", widthAdj + margin.right)
							.attr("height", heightAdj);
		
		};
		
		updateData = function() {
		
		var xScale = d3.scale.linear().range([0, widthAdj]),	
			yScale = d3.scale.ordinal().rangeRoundBands([0, heightAdj], .1),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatPercent),
			yAxis = d3.svg.axis().scale(yScale).orient("left");
		
			var update = svg.selectAll("circle.dot")
				.data(data);
				
			update.attr("cx", function(d) { return xScale(d.var3); })
				.attr("cy", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
				.attr("r", dotSize)
		
			update.append("circle")
				.attr("class","dot")
				.attr("cx", function(d) { return xScale(d.var3); })
				.attr("cy", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
				.attr("r", dotSize)
		
			update.exit()
				.remove();
				
			var updateLines = svg.selectAll("line.dotLine")
				.data(function(d) { return d.values; });
				
			updateLines.attr("x2", function(d) { return xScale(d.var3); })
				.attr("y1", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
				.attr("y2", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); });
				
			updateLines.append("line")
				.attr("class", "dotLineSM")
				.attr("x1", 0)
				.attr("x2", function(d) { return xScale(d.var4); })
				.attr("y1", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); })
				.attr("y2", function(d) { return yScale(d.var1) + (yScale.rangeBand() / 2); });
				
			updateLines.exit()
				.remove();	
				
		};
		
	});
	
};
	
    chart.width = function(value) {
	
        if (!arguments.length) return width;
        width = value;
        if (typeof updateWidth === 'function') updateWidth();
        return chart;
		
    };

    chart.height = function(value) {
	
        if (!arguments.length) return height;
        height = value;
        if (typeof updateHeight === 'function') updateHeight();
        return chart;
		
    };

	chart.marginTop = function(value) {
		
		if (!arguments.length) return marginTop;
		marginTop = value;
		if (typeof updateMarginTop === 'function') updateMarginTop();
		return chart;
		
	};	
	
	chart.marginLeft = function(value) {
		
		if (!arguments.length) return marginLeft;
		marginLeft = value;
		if (typeof updateMarginLeft === 'function') updateMarginLeft();
		return chart;
		
	};

	chart.marginBottom = function(value) {
		
		if (!arguments.length) return marginBottom;
		marginBottom = value;
		if (typeof updateMarginBottom === 'function') updateMarginBottom();
		return chart;
		
	};
	
	chart.dotSize = function(value) {
		
		if (!arguments.length) return dotSize;
		dotSize = value;
		if (typeof updateDotSize === 'function') updateDotSize();
		return chart;
		
	};
	
	chart.animateTime = function(value) {
		
		if (!arguments.length) return animateTime;
		animateTime = value;
		if (typeof updateAnimateTime === 'function') updateAnimateTime();
		return chart;
		
	};

	chart.title = function(value) {
		
		if (!arguments.length) return title;
		title = value;
		if (typeof updateTitle === 'function') updateTitle();
		return chart;
		
	};	
	
	chart.clipName = function(value) {
		
		if (!arguments.length) return clipName;
		clipName = value;
		if (typeof updateClipName === 'function') updateClipName();
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
	
	var	width = 960,
		height = 650,
		marginTop = 40,
		marginLeft = 100,
		marginBottom = 20,
		animateTime = 1000,
		title1 = "Generic chart title #1. Update me using .title1()!",
		title2 = "Generic chart title #2. Update me using .title2()!",
		title3 = "Generic chart title #3. Update me using .title3()!",
		title4 = "Generic chart title #4. Update me using .title4()!",
		data = [];
		
	var updateWidth,
		updateHeight,
		updateMarginTop,
		updateMarginLeft,
		updateMarginBottom,
		updateAnimateTime,
		updateTitle1,
		updateTitle2,
		updateTitle3,
		updateTitle4,
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
	
		var aspect = width/height;
	
		var margin = {right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - marginTop - marginBottom;

		// buttons for filtering

		var buttons = d3.select(this)
			.append("div")
				.style({
					"max-width": width + "px",
					"margin": "0 auto"
				})
				.attr("id", "buttons")
				.attr("class", "filters")
				.html("Show data by: ");
		
		d3.select("#buttons")
			.append("button")
			.attr("class", "filterButton")
			.text("Race/Ethnicity")
			.on("click", function() { 
			
				updateData(1); 
				updateTitle1();
				
			});
	
		d3.select("#buttons")
			.append("button")
			.attr("class", "filterButton")
			.text("Gender")
			.on("click", function() { 
			
				updateData(2); 
				updateTitle2();
				
			});
			
		d3.select("#buttons")
			.append("button")
			.attr("class", "filterButton")
			.text("IDEA Status")
			.on("click", function() { 
			
				updateData(3); 
				updateTitle3();
				
			});

		d3.select("#buttons")
			.append("button")
			.attr("class", "filterButton")
			.text("LEP Status")
			.on("click", function() { 
			
				updateData(4); 
				updateTitle4();
				
			});

		d3.select("#buttons")
			.append("p")
				.html("&nbsp"); 
			
		// selections
			
		var dom = d3.select(this)
			.append("div")
				.style({
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
					});				
		
		var svg = dom.append("svg")
			.attr("class", "groupedBar")
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.style({
				"max-width": width,
				"max-height": height,
				"position": "absolute",
				"top": 0,
				"left": 0,
				"width": "100%",
				"height": "100%"
			})
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
					
		// tooltips using d3-tip
		
		var tipBar = d3.tip()
			.attr("class", "d3-tip-bar")
			.direction("e")	
			.offset([0, 10])
			.html(function(d) {
	
			return d.level + "</br>" + formatComma(d.number) + " (" + formatPercent(d.pct) + ")";
	
		});
		
		svg.call(tipBar);
		
		// axis scales
		
		var xScale = d3.scale.linear().range([0, widthAdj - 100]),	
			yScale0 = d3.scale.ordinal().rangeRoundBands([0, heightAdj], 0.15),
			yScale1 = d3.scale.ordinal();
		
		var color = d3.scale.ordinal().range(["rgb(239, 142, 173)", "rgb(213, 161, 102)", "rgb(122, 186, 127)", "rgb(0, 189, 213)", "#DDD"]);
		
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
		
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatValueAxis).tickSize(-1 * heightAdj),
			yAxis = d3.svg.axis().scale(yScale0).orient("left").tickSize(0);
					
		// draw x-axis below bars
	
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.call(xAxis)
			.selectAll(".tick text")
				.attr("dx", "1em")
				.attr("dy", "-0.5em");
	
		svg.append("text")
			.attr("class", "x axis")
			.attr("x", widthAdj)
			.attr("dx", "1.5em")
			.attr("y", heightAdj)
			.attr("dy", "1.5em")
			.attr("text-anchor", "end")
			.text("(% CHRONICALLY ABSENT IN 2013-14)")

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
					.attr("y", function(d) { return yScale0(d.group); })
					.attr("height", yScale0.rangeBand())
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide)
					.transition()
						.duration(animateTime)
						.attr("width", function(d) { return xScale(d.pct); })

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
				.attr("y", function(d) { return yScale1(d.level); })
				.attr("height", 0)
				.style("fill", function(d) { return color(d.level); })
				.on("mouseover", tipBar.show)
				.on("mouseout", tipBar.hide)
				.transition()
					.delay(animateTime)
					.duration(animateTime)
					.attr("width", function(d) { return xScale(d.pct); })
					.attr("height", yScale1.rangeBand());
			
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
				
		legend.append("rect")
			.attr("x", widthAdj - 95)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);
			
		legend.append("text")
			.attr("x", widthAdj - 70)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "start")
			.text(function(d) { return d; });
		
		// update functions
		
		updateWidth = function() {};
			
		updateHeight = function() {};
		
		updateMarginTop = function() {};
		
		updateMarginLeft = function() {};
		
		updateMarginBottom = function() {};
		
		updateAnimateTime = function() {};

		function updateTitle1() {
			
			svg.select(".title")
				.transition()
					.duration(animateTime)
					.attr("fill-opacity", 0)
					.remove();
			
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
					
		};

		function updateTitle2() {
			
			svg.select(".title")
				.transition()
					.duration(animateTime)
					.attr("fill-opacity", 0)
					.remove();
			
			svg.append("text")
				.attr("class", "title")
				.attr("x", 0 - marginLeft)
				.attr("y", 0 - marginTop)
				.attr("dy", "1em")
				.attr("text-anchor", "start")
				.attr("fill-opacity", 0)
				.text(title2)
				.transition()
					.duration(animateTime)
					.attr("fill-opacity", 1);
					
		};

		function updateTitle3() {
			
			svg.select(".title")
				.transition()
					.duration(animateTime)
					.attr("fill-opacity", 0)
					.remove();
			
			svg.append("text")
				.attr("class", "title")
				.attr("x", 0 - marginLeft)
				.attr("y", 0 - marginTop)
				.attr("dy", "1em")
				.attr("text-anchor", "start")
				.attr("fill-opacity", 0)
				.text(title3)
				.transition()
					.duration(animateTime)
					.attr("fill-opacity", 1);
					
		};
		
		function updateTitle4() {
			
			svg.select(".title")
				.transition()
					.duration(animateTime)
					.attr("fill-opacity", 0)
					.remove();
			
			svg.append("text")
				.attr("class", "title")
				.attr("x", 0 - marginLeft)
				.attr("y", 0 - marginTop)
				.attr("dy", "1em")
				.attr("text-anchor", "start")
				.attr("fill-opacity", 0)
				.text(title4)
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
				.attr("y", function(d) { return yScale0(d.group); })
				.attr("height", yScale0.rangeBand());
			
			updateNational.enter()
				.append("g")
					.attr("transform", "translate(0,0)")
					.append("rect")
						.attr("class","national-bar")
						.attr("x", 0)
						.attr("width", 0)
						.attr("y", function(d) { return yScale0(d.group); })
						.attr("height", yScale0.rangeBand())
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
				.duration(animateTime)
				.attr("x", 0)
				.attr("width", function(d) { return xScale(d.pct); })
				.attr("y", function(d) { return yScale1(d.level); })
				.attr("height", yScale1.rangeBand());

			updateBars.enter()
				.append("rect")
					.attr("class", "bar")
					.attr("x", 0)
					.attr("width", 0)
					.attr("y", function(d) { return yScale1(d.level); })
					.attr("height", 0)
					.style("fill", function(d) { return color(d.level); })
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide)
					.transition()
						.delay(animateTime)
						.duration(animateTime)
						.attr("width", function(d) { return xScale(d.pct); })
						.attr("height", yScale1.rangeBand());

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
		
	});
	
};
	
    chart.width = function(value) {
	
        if (!arguments.length) return width;
        width = value;
        if (typeof updateWidth === 'function') updateWidth();
        return chart;
		
    };

    chart.height = function(value) {
	
        if (!arguments.length) return height;
        height = value;
        if (typeof updateHeight === 'function') updateHeight();
        return chart;
		
    };

	chart.marginTop = function(value) {
		
		if (!arguments.length) return marginTop;
		marginTop = value;
		if (typeof updateMarginTop === 'function') updateMarginTop();
		return chart;
		
	};
	
	chart.marginLeft = function(value) {
		
		if (!arguments.length) return marginLeft;
		marginLeft = value;
		if (typeof updateMarginLeft === 'function') updateMarginLeft();
		return chart;
		
	};
	
	chart.marginBottom = function(value) {
		
		if (!arguments.length) return marginBottom;
		marginBottom = value;
		if (typeof updateMarginBottom === 'function') updateMarginBottom();
		return chart;
		
	};

	chart.animateTime = function(value) {
		
		if (!arguments.length) return animateTime;
		animateTime = value;
		if (typeof updateAnimateTime === 'function') updateAnimateTime();
		return chart;
		
	};

	chart.title1 = function(value) {
		
		if (!arguments.length) return title1;
		title1 = value;
		if (typeof updateTitle === 'function') updateTitle1();
		return chart;
		
	};

	chart.title2 = function(value) {
		
		if (!arguments.length) return title2;
		title2 = value;
		if (typeof updateTitle2 === 'function') updateTitle2();
		return chart;
		
	};
	
	chart.title3 = function(value) {
		
		if (!arguments.length) return title3;
		title3 = value;
		if (typeof updateTitle3 === 'function') updateTitle3();
		return chart;
		
	};
	
	chart.title4 = function(value) {
		
		if (!arguments.length) return title4;
		title4 = value;
		if (typeof updateTitle4 === 'function') updateTitle4();
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