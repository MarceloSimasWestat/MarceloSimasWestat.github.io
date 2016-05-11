// Reusable bar chart function for chronic absenteeism storymap

function colChart() {
	
	// Options accessible to the caller
	// These are the default values
	
	var	width = 960,
		height = 500,
		marginLeft = 40,
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
		
		var margin = {top: 20, right: 20},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - margin.top - marginBottom;		
		
		// selections
		
		var dom = d3.select(this);
		
		var svg = dom.append("svg")
			.attr("class", "col-chart")
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.style("max-width", width)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + margin.top + ")");
		
		// tooltips using d3-tip
		
		var tipCol = d3.tip()
			.attr("class", "d3-tip-col")
			.offset([-10, 0])
			.html(function(d) {
	
			return formatComma(d.var2) + " (" + formatPercent(d.var3) + ")";
	
		});
		
		svg.call(tipCol);
		
		// axis scales and axes
		
		var xScale = d3.scale.ordinal().rangeRoundBands([0, widthAdj], .1),	
			yScale = d3.scale.linear().range([heightAdj, 0]),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
			yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(formatPercent);
		
		// domains
		
		xScale.domain(data.map(function(d, i) { return d.var1; }));
		yScale.domain([0, d3.max(data, function(d) { return d.var3; })]).nice();
	
		// draw columns
		
		var cols = svg.selectAll("rect.column")
			.data(data)
			.enter()
			.append("g")
				.attr("transform", "translate(0,0)");
		
		var max = d3.max(data, function(d) { return d.var3; });
		
		cols.append("rect")
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
			.call(xAxis)
			.selectAll(".tick text")
				.call(wrap, xScale.rangeBand());
	
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);
		
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

		updateMarginLeft = function() {
			
			widthAdj = width - marginLeft - margin.right;
			
		};
		
		updateMarginBottom = function() {
			
			heightAdj = height - margin.top - marginBottom;
			
		};
		
		updateAnimateTime = function() {
			
			cols.transition().duration(animateTime);
		
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
      };
    };
  });
};