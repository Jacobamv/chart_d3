var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function(data) {

	var color = d3.scaleOrdinal()
		.range(['#FF5967','#24CCB8','#FFD322','#FF8B8B','#70CCFF','#AE7EFC','#8EE765','#89A8F4','#FE9A6F']);

  var x = d3.scaleLinear()
      .domain([0, 1000])
      .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
	  .attr("class", "xAxis")
      .call(d3.axisBottom(x));

  var y = d3.scaleLinear()
      .range([height, 0]);
  var yAxis = svg.append("g")
	.attr("class", "yAxis")

	var div = d3.select("main").append("div")
     .attr("class", "tooltip-donut")
     .style("opacity", 0);

  function update(nBin) {

    var histogram = d3.histogram()
        .value(function(d) { return d.price; })  
        .domain(x.domain()) 
        .thresholds(x.ticks(nBin));

    var bins = histogram(data);

    y.domain([0, d3.max(bins, function(d) { return d.length * 1.1; })]);  
    yAxis
        .transition()
        .duration(1000)
		.call(d3.axisLeft(y).tickSize(-width*1.3).ticks(10)) 

	svg.selectAll(".yAxis .tick line").attr("stroke", "#DCDFE3")

	yAxis.select(".tick").remove()

    var u = svg.selectAll("rect")
        .data(bins)

    u
        .enter()
        .append("rect") 
		.on('mouseover', function (d, i) {
			d3.select(this).transition()
				.duration('50')
				.attr('opacity', '.85')
			div.transition()
				.duration(50)
				.style("opacity", 1);
				
			})
			.on('mousemove', function(d, i) {
				div.html(d.length + "$")
					.style("left", (d3.event.pageX + 10) + "px")
					.style("top", (d3.event.pageY - 15) + "px");
			})
			.on('mouseout', function (d, i) {
			d3.select(this).transition()
				.duration('50')
				.attr('opacity', '1')
			div.transition()
				.duration('50')
				.style("opacity", 0);
			})
        .merge(u)
        .transition()
        .duration(1000)
          .attr("x", 1)
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", function(d, i) { return color(i % 3) })
		


    u
      .exit()
      .remove()

    }


  update(20)


  d3.select("#dataset1").on("click", function() {
    update(20);
  });
  d3.select("#dataset2").on("click", function() {
    update(50);
  });
});