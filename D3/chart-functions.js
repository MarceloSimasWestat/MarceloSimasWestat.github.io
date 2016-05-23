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
		data = [];
		
	var updateWidth,
		updateHeight,
		updateAnimateTime,
		updateRowCount,
		updateIconWidth,
		updateIconHeight,
		updateLegendWidth,
		updateLegendHeight,
		updateData;

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
					.attr("id", "iconArray")
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
					"height": legendHeight + "px"
				});	
		
			d3.xml("Images/chair.svg", "image/svg+xml", function(error, xml) {  
			
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
					"vertical-align": "middle"
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
						"height": "135px"
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
				.transition()
					.duration(animateTime)
					.attr("fill-opacity", 1)
					.tween("text", function(d) {
						
						var i = d3.interpolate(0, d.number);
						var j = d3.interpolate(0, d.pct);
						
						return function(t) { this.textContent = formatNumber(i(t)); };
						
					});
			
			count.append("text")
				.attr("class", "countText")
				.attr("x", (width / 2))
				.attr("dy", 100)
				.attr("text-anchor", "middle")
				.attr("fill-opacity", 0)
				.transition()
					.duration(animateTime)
					.attr("fill-opacity", 1)
					.tween("text", function(d) {
						
						var i = d3.interpolate(0, d.number);
						var j = d3.interpolate(0, d.pct);
						
						return function(t) { this.textContent = "students were chronically absent in 2013-14 (" + formatPercent(j(t)) + ")"; };
						
					});	
			
			// build icon array
			
			var ia = dom.append("div")
				.attr("id", "iaContainer")
				.style({
					"max-width": (rowCount * iconWidth) + "px",
					"margin": "0 auto",
					"display": "block",
					"text-align": "left"
				});
			
			d3.xml("Images/chair.svg", "image/svg+xml", function(xml) {  
			
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
					.attr("class", "icon")
					.transition()
						.delay(function(d, i) { return i * (animateTime/data_ia.length); })
						.duration(animateTime)
						.attr("opacity", 1);
				
			});
			
			// add equivalency section
			
			var txt = dom.append("div")
				.data(data_txt)
				.attr("id", "equiSection")
				.style({
					"width": "100%",
					"max-width": width + "px",
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
						"height": "175px"
					})
					.append("g")
						.attr("transform", "translate(0,0)");
			
			txt.append("text")
				.attr("class", "equivText")
				.attr("x", (width / 2))
				.attr("dy", 45)
				.attr("text-anchor", "middle")
				.attr("fill-opacity", 0)
				.text("Cumulatively, across those students, at least")
				.transition()
					.delay(animateTime)
					.duration(animateTime)
					.attr("fill-opacity", 1);

			txt.append("text")
				.attr("class", "equiv")
				.attr("x", (width / 2))
				.attr("dy", 115)
				.attr("text-anchor", "middle")
				.attr("fill-opacity", 0)
				.transition()
					.delay(animateTime)
					.duration(animateTime)
					.attr("fill-opacity", 1)
					.tween("text", function(d) {
						
						var i = d3.interpolate(0, d.number);
						var j = d3.interpolate(0, d.pct);
						
						return function(t) { this.textContent = formatNumber(i(15 * t)); };
						
					});

			txt.append("text")
				.attr("class", "equivText")
				.attr("x", (width / 2))
				.attr("dy", 155)
				.attr("text-anchor", "middle")
				.attr("fill-opacity", 0)
				.text("school days were missed")
				.transition()
					.delay(animateTime)
					.duration(animateTime)
					.attr("fill-opacity", 1);
					
		// update functions - these aren't really needed because there's no within chart updating
		
		updateWidth = function() {};			
		updateHeight = function() {};		
		updateAnimateTime = function() {};
		updateRowCount = function() {};
		updateIconWidth = function() {};
		updateIconHeight = function() {};
		updateLegendWidth = function() {};
		updateLegendHeight = function() {};
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

	chart.animateTime = function(value) {
		
		if (!arguments.length) return animateTime;
		animateTime = value;
		if (typeof updateAnimateTime === 'function') updateAnimateTime();
		return chart;
		
	};

	chart.rowCount = function(value) {
		
		if (!arguments.length) return rowCount;
		rowCount = value;
		if (typeof updateRowCount === 'function') updateRowCount();
		return chart;
		
	};

	chart.iconWidth = function(value) {
		
		if (!arguments.length) return iconWidth;
		iconWidth = value;
		if (typeof updateIconWidth === 'function') updateIconWidth();
		return chart;
		
	};

	chart.iconHeight = function(value) {
		
		if (!arguments.length) return iconHeight;
		iconHeight = value;
		if (typeof updateIconHeight === 'function') updateIconHeight();
		return chart;
		
	};
	
	chart.legendWidth = function(value) {
		
		if (!arguments.length) return legendWidth;
		legendWidth = value;
		if (typeof updateLegendWidth === 'function') updateLegendWidth();
		return chart;
		
	};

	chart.legendHeight = function(value) {
		
		if (!arguments.length) return legendHeight;
		legendHeight = value;
		if (typeof updateLegendHeight === 'function') updateLegendHeight();
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

// Donut chart function for chronic absenteeism map (ch 1-1)

function donutChart() {
	
	// Options accessible to the caller
	// These are the default values
	
	var	width = 500,
		height = 500,
		marginTop = 20,
		marginLeft = 20,
		marginBottom = 20,
		animateTime = 2000,
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

		var radius = Math.min(widthAdj, heightAdj) / 2;
			
		// Set colors for each slice
	
		var color = d3.scale.ordinal()
			.domain(function(d) { return d.var1;})
			.range(["#3e526e", "#98abc5"]);

		var arc = d3.svg.arc()
			.outerRadius(radius)
			.innerRadius(radius * 0.75)
			.startAngle(function(d) { return d.startAngle + Math.PI/3; })
			.endAngle(function(d) { return d.endAngle + Math.PI/3; });
	
		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { return d.var2; });

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
				.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

		// tooltips with d3-tip
			
		var tipDonut = d3.tip()
			.attr("class", "d3-tip-donut")
			.direction("e")	
			.offset([0, 0])
			.html(function(d) {

			return d.data.var1 + "</br>" + formatNumber(d.data.var2) + " (" + formatPercent(d.data.var3) + ")";

		});
	
		svg.call(tipDonut);
	
		// draw the arcs
		
		var gArc = svg.selectAll(".arc")
			.data(pie(data))
			.enter().append("g");
				
		gArc.append("path")
			.attr("class", "arc")
			.style("fill", function(d) { return color(d.data.var1); })
			.on("mouseover", tipDonut.show)
			.on("mouseout", tipDonut.hide)
			.transition()
				.delay(function(d, i) { return i * animateTime; })
				.duration(animateTime)
				.ease("linear")
				.attrTween("d", function(d) { 
				
					var i = d3.interpolate(d.startAngle, d.endAngle);
					
					return function(t) { d.endAngle = i(t); return arc(d); }
					
				});
	
		// add n-size in the center
		
		var cLabel = svg.selectAll(".cLabel")
			.data(data)
			.enter().append("g")
				.filter(function(d) { return d.var1 == "Chronically absent"; });		
		
		cLabel.append("text")
			.attr("class", "cLabel")
			.attr("text-anchor", "middle")
			.attr("fill-opacity", 0)
			.transition()
				.delay(animateTime)
				.duration(animateTime)
				.attr("fill-opacity", 1)
				.tween("text", function(d) {
					
					var i = d3.interpolate(0, d.var2);
					
					return function(t) { this.textContent = formatNumber(Math.round(i(t))); };
					
				});
				
		cLabel.append("text")
			.attr("class", "cLabelText")
			.attr("text-anchor", "middle")
			.attr("dy", "25px")
			.attr("fill-opacity", 0)
			.text(title)
			.transition()
				.delay(animateTime)
				.duration(animateTime)
				.attr("fill-opacity", 1);
					
		// update functions - these aren't really needed because there's no within chart updating
		
		updateWidth = function() {};			
		updateHeight = function() {};		
		updateMarginTop = function() {};		
		updateMarginLeft = function() {};		
		updateMarginBottom = function() {};		
		updateAnimateTime = function() {};
		updateTitle = function() {};		
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

function barChart() {
	
	// Options accessible to the caller
	// These are the default values
	
	var	width = 960,
		height = 500,
		marginTop = 40,
		marginLeft = 100,
		marginBottom = 40,
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
	
			return formatNumber(d.var2) + " (" + formatPercent(d.var3) + ")";
	
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
			yAxis = d3.svg.axis().scale(yScale).orient("left");
					
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
		
		// update functions - these aren't really needed because there's no within chart updating
		
		updateWidth = function() {};			
		updateHeight = function() {};
		updateMarginTop = function() {};		
		updateMarginLeft = function() {};		
		updateMarginBottom = function() {};		
		updateAnimateTime = function() {};
		updateTitle = function() {};		
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
	
			return formatNumber(d.var2) + " (" + formatPercent(d.var3) + ")";
	
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
		
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
			yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(formatValueAxis).tickSize(-1 * widthAdj);
		
		// draw y-axis under columns
		
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.selectAll("text")
					
		svg.append("text")
			.attr("class", "y axis")
			.attr("x", -15)
			.attr("y", "-1em")
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
				
		// update functions - these aren't really needed because there's no within chart updating
		
		updateWidth = function() {};		
		updateHeight = function() {};
		updateMarginTop = function() {};				
		updateMarginLeft = function() {};		
		updateMarginBottom = function() {};		
		updateAnimateTime = function() {};
		updateTitle = function() {};		
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
		marginBottom = 40,
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
	
			return formatNumber(d.var2) + " (" + formatPercent(d.var3) + ")";
	
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
			yAxis = d3.svg.axis().scale(yScale).orient("left");
	
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

// Grouped bar chart function for chronic absenteeism storymap

function groupedBar() {
	
	// Options accessible to the caller
	// These are the default values
	
	var	width = 960,
		height = 650,
		marginTop = 40,
		marginLeft = 100,
		marginBottom = 40,
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
	
			return d.level + "</br>" + formatNumber(d.number) + " (" + formatPercent(d.pct) + ")";
	
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
			yAxis = d3.svg.axis().scale(yScale0).orient("left");
					
		// draw x-axis below bars
	
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAdj + ")")
			.call(xAxis)
	
		svg.append("text")
			.attr("class", "x axis")
			.attr("x", widthAdj - 100)
			.attr("dx", "0.5em")
			.attr("y", heightAdj)
			.attr("dy", "2em")
			.attr("text-anchor", "end")
			.text("(% CHRONICALLY ABSENT IN 2013-14)");

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