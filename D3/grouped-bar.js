// Reusable grouped bar chart function for chronic absenteeism storymap

function groupedBar() {
	
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
		
		// filter data for default to show r/e categories
		
		data = data.filter(function(d) { return d.subchart == 1; });
		
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
		
		var xScale = d3.scale.linear().range([0, widthAdj]),	
			yScale0 = d3.scale.ordinal().rangeRoundBands([0, heightAdj], 0.15),
			yScale1 = d3.scale.ordinal();
		
		var color = d3.scale.ordinal().range(["rgb(239, 142, 173)", "rgb(213, 161, 102)", "rgb(122, 186, 127)", "rgb(0, 189, 213)", "#DDD"]);
		
		// domains
		
		data_nest = d3.nest()
			.key(function(d) { return d.group; })
			.entries(data);
					
		console.log(data_nest);
			
		var levels = ["Elementary","Middle","High","Other"];
			
		console.log(levels);
					
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
	
		data_national = data.filter(function(d) { return d.level == "Overall"; });
		
		console.log(data_national);
		
		var natBars = svg.selectAll(".national-bar")
			.data(data_national);
			
		natBars.enter()
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
					
		// draw bars

		data_noavg = data.filter(function(d) { return d.level != "Overall"; });
		
		data_nest_noavg = d3.nest()
			.key(function(d) { return d.group; })
			.entries(data_noavg);
		
		var groups = svg.selectAll(".group")
			.data(data_nest_noavg, function(d) { return d.key; });
			
		groups.enter()
			.append("g")
				.attr("class", "group")
				.attr("transform", function(d) { return "translate(0," + yScale0(d.key) + ")"; });	
		
		var bars = groups.selectAll(".bar")
			.data(function(d) { return d.values; })
			.enter()
			.append("rect")
				.attr("class", "bar")
				.attr("x", 0)
				.attr("width", 0)
				.attr("y", function(d) { return yScale1(d.level); })
				.attr("height", yScale1.rangeBand())
				.style("fill", function(d) { return color(d.level); })
				.on("mouseover", tipBar.show)
				.on("mouseout", tipBar.hide)
				.transition()
					.duration(animateTime)
					.attr("width", function(d) { return xScale(d.pct); })
				
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
		
		updateWidth = function() {
			
			svg.attr("width", widthAdj);
			bars.attr("width", function(d) { return xScale(d.pct); });
			
		};
			
		updateHeight = function() {
			
			svg.attr("height", heightAdj);
			bars.attr("y", function(d) { return yScale1(d.level); })
						
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
		
			var data_nest = d3.nest()
				.key(function(d) { return d.group; })
				.entries(data);
					
			console.log(data_nest);
		
			var xScale = d3.scale.linear().range([0, widthAdj]),	
				yScale0 = d3.scale.ordinal().rangeRoundBands([0, heightAdj], 0.1),
				yScale1 = d3.scale.ordinal();
				xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(formatValueAxis).tickSize(-1 * heightAdj),
				yAxis = d3.svg.axis().scale(yScale0).orient("left").tickSize(0);
				
			xScale.domain([0, d3.max(data, function(d) { return d.pct; })]).nice();
			yScale0.domain(data_nest.map(function(d) { return d.key; }));
		
			// draw total bars
	
			var updateNational = svg.selectAll(".total-bar")
				.data(data_nest, function(d) { return d.key; });
			
			updateNational.attr("x", 0)
				.attr("width", function(d) { return xScale(d.pct); })
				.attr("y", function(d) { return yScale0(d.key); })
				.attr("height", yScale0.rangeBand());
			
			updateNational.enter()
				.append("rect")
					.attr("class", "total-bar")
					.attr("x", 0)
					.attr("width", 0)
					.attr("y", function(d) { return yScale0(d.key); })
					.attr("height", yScale0.rangeBand())
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide)
					.transition()
						.duration(animateTime)
						.attr("width", xScale(0.25));
	
			update.exit()
				.remove();
	
			// draw bars
		
			var updateGroups = svg.selectAll(".group")
				.data(data_nest, function(d) { return d.key; })
				
			updateGroups.attr("transform", function(d) { return "translate(0," + yScale0(d.key) + ")"; });
			
			updateGroups.enter()
				.append("g")
					.attr("class", "group")
					.attr("transform", function(d) { return "translate(0," + yScale0(d.key) + ")"; });	
			
			updateGroups.exit()
				.remove();
			
			var updateBars = updateGroups.selectAll(".bar")
				.data(function(group) { return group.values; }, function(d) { return d.key; })
			
			updateBars.attr("y", function(d) { return yScale1(d.key); })
				.attr("height", yScale1.rangeBand())
				.attr("width", function(d) { return xScale(d.pct); });
			
			updateBars.enter()
				.append("rect")
					.attr("class", "bar")
					.attr("x", 0)
					.attr("width", 0)
					.attr("y", function(d) { return yScale1(d.key); })
					.attr("height", yScale1.rangeBand())
					.style("fill", function(d) { return color(d.key); })
					.on("mouseover", tipBar.show)
					.on("mouseout", tipBar.hide)
					.transition()
						.duration(animateTime)
						.attr("width", function(d) { return xScale(d.pct); })
						
			updateBars.exit()
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