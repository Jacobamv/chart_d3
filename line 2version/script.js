var data1 = [
  {ser1: 0.3, ser2: 4},
  {ser1: 2, ser2: 16},
  {ser1: 3, ser2: 8}
];

var data2 = [
  {ser1: 1, ser2: 7},
  {ser1: 4, ser2: 1},
  {ser1: 6, ser2: 8},
  {ser1: 10, ser2: 12}
];

var color = d3.scaleOrdinal()
  .range(['#FF5967','#24CCB8','#FFD322','#FF8B8B','#70CCFF','#AE7EFC','#8EE765','#89A8F4','#FE9A6F']);

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 50},
   width = 1060 - margin.left - margin.right,
   height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
 .append("svg")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom)
 .append("g")
   .attr("transform",
         "translate(" + margin.left + "," + margin.top + ")");
         
  // Initialize an Y axis
  var y = d3.scaleLinear().range([height, 0]);
  var yAxis = d3.axisLeft().scale(y);
  svg.append("g")
  .attr("class","myYaxis")
  .call(d3.axisLeft(y).tickSize(-width*1.3).ticks(7)) 
  .selectAll("text")
    .style("font-size", "1.6em")
// Initialise a X axis:
var x = d3.scaleLinear().range([0,width]);
var xAxis = d3.axisBottom().scale(x);
svg.append("g")
 .attr("transform", "translate(0," + height + ")")
 .attr("class","myXaxis")


// Create a function that takes a dataset as input and update the plot:
function update(data) {

  var parseDate = d3.timeFormat("%m/%e/%Y").parse,
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(","),
    dateFormatter = d3.timeFormat("%m/%d/%y");

  var focus = svg.append("g")
    .attr("class", "focus")
    .style("display", "none");

  focus.append("circle")
      .attr("r", 5);

  focus.append("rect")
    .attr("class", "tooltip")
    .attr("width", 100)
    .attr("height", 50)
    .attr("x", 10)
    .attr("y", -22)
    .attr("rx", 4)
    .attr("ry", 4);

  focus.append("text")
    .attr("class", "tooltip-date")
    .attr("x", 18)
    .attr("y", -2);

  focus.append("text")
    .attr("x", 18)
    .attr("y", 18)
    .text("Value:");

  focus.append("text")
    .attr("class", "tooltip-likes")
    .attr("x", 60)
    .attr("y", 18);


  // create the Y axis
  y.domain([0, d3.max(data, function(d) { return d.ser2  }) ]);
  svg.selectAll(".myYaxis")
    .transition()
    .duration(3000)
    .call(d3.axisLeft(y).tickSize(-width*1.3).ticks(7)) 
    .selectAll("text")
    .style("font-size", "1.6em")
  
  // Create the X axis:
  x.domain([0, d3.max(data, function(d) { return d.ser1 }) ]);
  svg.selectAll(".myXaxis").transition()
    .duration(3000)
    .call(xAxis);

  svg.selectAll(".tick line").attr("stroke", "#DCDFE3")
  
  svg.select(".domain").remove()

  svg.selectAll("text")
      .style("font-size", "1.6em")

 // Create a update selection: bind to the new data
 var u = svg.selectAll(".lineTest")
   .data([data], function(d){ return d.ser1 });

 // Updata the line
 u
   .enter()
   .append("path")
   .attr("class","lineTest")
   .merge(u)
   .transition()
   .duration(3000)
   .attr("d", d3.line()
     .x(function(d) { return x(d.ser1); })
     .y(function(d) { return y(d.ser2); }))
     .attr("fill", "none")
     .attr("stroke", "steelblue")
     .attr("stroke-width", 2.5)

  u.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { focus.style("display", null); mousemove(this) })
    .on("mouseout", function() { focus.style("display", "none"); })
    .on("mousemove", function() { mousemove(this) });

  const mousemove = (e) => {
    var x0 = x.invert(d3.mouse(e)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
    focus.select(".tooltip-date").text(dateFormatter(d.date));
    focus.select(".tooltip-likes").text(formatValue(d.value));
  }
}

// At the beginning, I run the update function on the first dataset:
update(data1)