// Reusable bar chart function for chronic absenteeism storymap

function barChart() {
	
	// Options accessible to the caller
	// These are the default values
	
	var	width = 960,
		height = 500,
		marginLeft = 100,
		marginBottom = 20,
		animateTime = 500,
		data = [];
		
	var updateWidth,
		updateHeight,
		updateMarginLeft,
		updateMarginBottom,
		updateAnimateTime,
		updateData;
		
	function chart(selection) {
		selection.each(function() {
		
		// formats
		
		var	formatComma = d3.format(",f"),
			formatPercent = d3.format(",.1%"),
			formatPercentNoDec = d3.format(",%");
		
		// margins; adjust width and height to account for margins
	
		var aspect = width/height;
	
		var margin = {top: 20, right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - margin.top - marginBottom;

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
				.attr("transform", "translate(" + marginLeft + "," + margin.top + ")");
					
		// tooltips using d3-tip
		
		var tipBar = d3.tip()
			.attr("class", "d3-tip-bar")
			.direction("e")	
			.offset([0, 10])
			.html(function(d) {
	
			return formatComma(d.var2) + " (" + formatPercent(d.var3) + ")";
	
		});
		
		svg.call(tipBar);
		
		// axis scales and axes
		
		var xScale = d3.scale.linear().range([0, widthAdj]),	
			yScale = d3.scale.ordinal().range([heightAdj, 0]).rangeRoundBands([0, heightAdj], .1),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatPercent),
			yAxis = d3.svg.axis().scale(yScale).orient("left");
		
		// domains
		
		xScale.domain([0, d3.max(data, function(d) { return d.var3; })]).nice();
		yScale.domain(data.map(function(d, i) { return d.var1; }));
	
		// draw bars
		
		var bars = svg.selectAll("rect.bar")
			.data(data);
		
		var max = d3.max(data, function(d) { return d.var3; });
				
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
										
						// highlight if max
					
						.each("end", function(d) { if (d.var3 == max) {
							d3.select(this)
								.transition()
									.duration(animateTime)
									.attr("class", "bar max");
						}});
				
		// draw axes
	
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.call(xAxis);
	
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			//.selectAll(".tick text") 
			//	.call(wrap, marginLeft - 10);
		
		// update functions
		
		updateWidth = function() {
			
			svg.attr("width", widthAdj);
			bars.attr("width", function(d) { return xScale(d.var3); });
			
		};
			
		updateHeight = function() {
			
			svg.attr("height", heightAdj);
			bars.attr("y", function(d) { return yScale(d.var1); })
						
		};
		
		updateMarginLeft = function() {
			
			widthAdj = width - marginLeft - margin.right;
			
		};
		
		updateMarginBottom = function() {
			
			heightAdj = width - margin.top - marginBottom;
			
		};
		
		updateAnimateTime = function() {
			
			bars.transition().duration(animateTime);
		
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