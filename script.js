var width = 450
    height = 450
    margin = 40

var radius = Math.min(width, height) / 2 - margin

var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height * 2)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var data = {a: 9, b: 20, c:30, d:8, e:12}

var total = 0;

for (var property in data) {
    total += data[property];
}

var div = d3.select("main").append("div")
     .attr("class", "tooltip-donut")
     .style("opacity", 0);

var color = d3.scaleOrdinal()
    .domain(data)
    .range(['#FF5967','#24CCB8','#FFD322','#FF8B8B','#70CCFF','#AE7EFC','#8EE765','#89A8F4','#FE9A6F'])

var pie = d3.pie()
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))

svg
  .selectAll('whatever')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(90)         
    .outerRadius(radius)
  )
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "black")
  .style("stroke-width", "0px")
  .on('mouseover', function (d, i) {
    d3.select(this).transition()
      .duration('50')
      .attr('opacity', '.85')
      .attr('d', d3.arc()
        .innerRadius(90)
        .outerRadius(radius + 10)
      )
    div.transition()
      .duration(50)
      .style("opacity", 1);
      
    })
  .on('mousemove', function(d, i) {
    let num = (Math.round((d.value / total) * 100)).toString() + '%';
    div.html(num)
      .style("left", (d3.event.pageX + 10) + "px")
      .style("top", (d3.event.pageY - 15) + "px");
  })
  .on('mouseout', function (d, i) {
    d3.select(this).transition()
      .duration('50')
      .attr('opacity', '1')
      .attr('d', d3.arc()
        .innerRadius(90)
        .outerRadius(radius)
      )
    div.transition()
      .duration('50')
      .style("opacity", 0);
  });

var keys = ["Mister A", "Brigitte", "Eleonore", "Another friend", "Batman"]

var color = d3.scaleOrdinal()
  .domain(keys)
  .range(['#FF5967','#24CCB8','#FFD322','#FF8B8B','#70CCFF','#AE7EFC','#8EE765','#89A8F4','#FE9A6F']);

svg.selectAll("mydots")
  .data(keys)
  .enter()
  .append("circle")
    .attr("cx", -150)
    .attr("cy", function(d,i){ return 200 + i*25})
    .attr("r", 7)
    .style("fill", function(d){ return color(d)})

svg.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", -130)
    .attr("y", function(d,i){ return 205 + i*25})
    .style("fill", function(d){ return color(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
