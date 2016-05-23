// Reusable dot plot function for chronic absenteeism story map

function scatterPlot() {
	
	// Options accessible to the caller
	// These are the default values
	
	var	width = 960,
		height = 500,
		marginTop = 40,
		marginLeft = 20,
		marginBottom = 20,
		dotSize = 1,
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
		
		var margin = {right: 25},
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
			.attr("class", "scatterPlot")
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
		
		/* var tipDot = d3.tip()
			.attr("class", "d3-tip-dot")
			.direction("e")	
			.offset([0, 10])
			.html(function(d) {
	
			return formatNumber(d.var2) + " (" + formatPercent(d.var3) + ")";
	
		});
		
		svg.call(tipDot); */
		
		// axis scales and axes
		
		var xScale = d3.scale.linear().range([0, widthAdj]),
			yScale = d3.scale.linear().range([heightAdj, 0]);
		
		// domains
		
		xScale.domain([0, d3.max(data, function(d) { return d.var3; })]).nice();
		yScale.domain([0, d3.max(data, function(d) { return d.var2; })]).nice();	

		// axes
		
		function formatValueAxis(d) {
			
			var TickValue = formatNumber(d * 100);
			
			return TickValue;
			
		};
		
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatValueAxis).tickSize(-1 * heightAdj),
			yAxis = d3.svg.axis().scale(yScale).orient("right").tickFormat(formatValueAxis).tickSize(widthAdj);
	
		// draw dots
		
		var dots = svg.selectAll("circle.mark")
			.data(data);
						
		dots.enter()
			.append("g")
				.attr("transform", "translate(0,0)")
				.append("circle")
					.attr("class", "mark")
					.attr("clip-path", function() { return "url(#clip)" + clipName + ")"; })
					.attr("cx", 0)
					.attr("cy", function(d) { return yScale(d.var2); })
					.attr("r", 1)
					//.on("mouseover", tipDot.show)
					//.on("mouseout", tipDot.hide)
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
		
		// draw x-axis
			
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
			.text("(% TEACHER ABSENTEEISM IN 2013-14)");	

		// draw y-axis
		
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

		// chart title
		
		svg.append("text")
			.attr("class", "title")
			.attr("x", 0 - marginLeft)
			.attr("y", 0 - marginTop)
			.attr("dy", "1em")
			.attr("text-anchor", "start")
			.text(title);			
		
		// update functions - these aren't really needed because there's no within chart updating
		
		updateWidth = function() {};			
		updateHeight = function() {};		
		updateMarginTop = function() {};	
		updateMarginLeft = function() {};
		updateMarginBottom = function() {};		
		updateDotSize = function() {};		
		updateAnimateTime = function() {};
		updateTitle = function() {};		
		updateClipName = function() {};		
		updateData = function() {};
		
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