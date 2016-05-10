// Reusable bar chart function

function barChart() {
	
	// Options accessible to the caller
	// These are the default values
	
	var	width = 960,
		height = 500,
		marginLeft = 100,
		data = [];
		
	var updateWidth,
		updateHeight,
		updateMarginLeft,
		updateData;
		
	function chart(selection) {
		selection.each(function() {
		
		// formats
		
		var	formatComma = d3.format(",f"),
			formatPercent = d3.format(",.1%"),
			formatPercentNoDec = d3.format(",%");
		
		// margins; adjust width and height to account for margins
		
		var margin = {top: 20, right: 20, bottom: 60},
			widthAdj = width - marginLeft - margin.right,
			heightAdj = height - margin.top - margin.bottom;

		// define bar spacing and bar height

		var maxValue = d3.max(data, function(d) { return d.pct; }),
			widthScale = widthAdj / maxValue;
		
		// selections
		
		var dom = d3.select(this);
		
		var svg = dom.append("svg")
			.attr("class", "bar-chart")
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(" + marginLeft + "," + margin.top + ")");
		
		// tooltips using d3-tip
		
		var tipBar = d3.tip()
			.attr("class", "d3-tip-bar")
			.direction("e")	
			.offset([0, 10])
			.html(function(d) {
	
			return formatComma(d.number) + " (" + formatPercent(d.pct) + ")";
	
		});
		
		svg.call(tipBar);
		
		// axis scales and axes
		
		var xScale = d3.scale.linear().range([0, widthAdj]),	
			yScale = d3.scale.ordinal().range([heightAdj, 0]).rangeRoundBands([0, heightAdj], .1),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatPercent),
			yAxis = d3.svg.axis().scale(yScale).orient("left");
		
		// domains
		
		xScale.domain([0, d3.max(data, function(d) { return d.pct; })]).nice();
		yScale.domain(data.map(function(d, i) { return d.group; }));
	
		// draw bars
		
		var bars = svg.selectAll("rect.bar")
			.data(data)
			.enter()
			.append("g")
				.attr("transform", "translate(0,0)");
					
		bars.append("rect")
			.attr("class","bar")
			.attr("x", 0)
			.attr("width", 0)
			.attr("y", function(d) { return yScale(d.group); })
			.attr("height", yScale.rangeBand())
			.on("mouseover", tipBar.show)
			.on("mouseout", tipBar.hide)
			.transition()
				.duration(500)
				.attr("width", function(d) { return d.pct * widthScale; })
								
				// highlight if max
			
				.each("end", function(d) { if (d.pct == maxValue) {
					svg.select(".bar")
						.transition()
							.duration(500)
							.style("fill", "#8a89a6");
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
			
			widthScale = width / maxValue;
			
			svg.attr("width", widthAdj);
			bars.attr("width", function(d) { return d.pct * widthScale; });
			
		};
			
		updateHeight = function() {
			
			svg.attr("height", heightAdj);
			bars.attr("y", function(d) { return yScale(d.group); })
						
		};
		
		updateMarginLeft = function() {
			
			widthAdj = width - marginLeft - margin.right;
			
		};
		
		updateData = function() {
		
		var xScale = d3.scale.linear().range([0, widthAdj]),	
			yScale = d3.scale.ordinal().range([heightAdj, 0]),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatPercent),
			yAxis = d3.svg.axis().scale(yScale).orient("left");
		
			var update = svg.selectAll("rect.bar")
				.data(data);
				
			update.attr("x", marginLeft)
				.attr("width", function(d) { return d.pct * widthScale; })
				.attr("y", function(d) { return yScale(d.group); })
				.attr("height", yScale.rangeBand())
		
			update.enter()
				.append("rect")
				.attr("class","bar")
				.attr("x", marginLeft)
				.attr("width", function(d) { return d.pct * widthScale; })
				.attr("y", function(d) { return yScale(d.group); })
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