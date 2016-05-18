var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var y0 = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .1);

var y1 = d3.scale.ordinal();


var x = d3.scale.linear()
    .range([0, width-100]);

var color = d3.scale.ordinal()
    .range(["rgb(239, 142, 173)", "rgb(213, 161, 102)", "rgb(122, 186, 127)", "rgb(0, 189, 213)", "#DDD"]);

var yAxis = d3.svg.axis()
    .scale(y0)
    .orient("left")
    .tickSize(0,0);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(height)
    .tickFormat(d3.format(".2s"));
  

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = [];
var url = 'http://tour-pedia.org/api/getPlacesStatistics';
d3.json(url, function(apidata) {

  var data = Object.keys(apidata).map(function(city_name){
    return {
      name: city_name,
      categories: Object.keys(apidata[city_name]).map(function(cat_name){
        return {
          name: cat_name,
          value: apidata[city_name][cat_name] 
        }
      })

    };
  });

  console.log(data);
  var categories =['accommodation','attraction','restaurant','poi'];
  y0.domain(data.map(function(d){ return d.name; }));
  y1.domain(categories).rangeRoundBands([0, y0.rangeBand()], 0.15);
  x.domain([0, d3.max(data, function(city) {
    return d3.sum(city.categories, function(d) { return d.value; });
  })]);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis)
    .append("text")
      .attr("x", width)
      .attr("y", height+5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("# of Places");

  var totals = svg.selectAll(".total_bar")
      .data(data, function(d){ return d.name; })
    .enter().append("rect")
      .attr("class", "total_bar")
      .attr("height", y0.rangeBand())
      .attr("x", 2) 
      .attr("y", function(d) { return y0(d.name); })
      .attr("width", 0);
  
  totals.transition()
    .duration(600)
      .ease("linear")
        .attr("width", function(city) {
          return x(d3.sum(city.categories, function(d) { return d.value; }));
        });

  var zero=d3.format(".4s");

  totals.append("title")
    .text(function(city){
      return "Total: " + zero(d3.sum(city.categories, function(d) { return d.value; }))
    })

  var cities = svg.selectAll(".city")
      .data(data, function(d){ return d.name; })
    .enter().append("g")
      .attr("class", "city")
      .attr("transform", function(d) { return "translate(0," + y0(d.name) + ")"; });
  
  var bars = cities.selectAll(".bar")
      .data(function(city) { return city.categories; }, function(d){ return d.name; })
    .enter().append("rect")
      .attr("class", "bar")
      .attr("height", y1.rangeBand())
      .attr("x", 2) 
      .attr("y", function(d) { return y1(d.name); })
      .attr("width", 0)
      .style("fill", function(d) { return color(d.name); });
      
  bars.transition()
    .duration(600)
      .ease("linear")
        .attr("width", function(d) { return x(d.value)});

  bars.append("title")
    .text(function(d){
      return zero(d.value)
    })
 
  var legend = svg.selectAll(".legend")
      .data(categories.concat(["total"]))
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width-100)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 70)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d; });



})
