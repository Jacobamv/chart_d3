var margin = {top: 100, right: 0, bottom: 30, left: 60},
    width = 1260 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    
    var parseDate = d3.timeFormat("%m/%e/%Y").parse,
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(","),
    dateFormatter = d3.timeFormat("%m/%d/%y");
    
    var color = d3.scaleOrdinal()
    .range(['#FF5967','#24CCB8','#FFD322','#FF8B8B','#70CCFF','#AE7EFC','#8EE765','#89A8F4','#FE9A6F']);
    
    
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",
    
    function(d){
      return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
    },
    
    function(data) {
      var svg = d3.select("#my_dataviz")
        .append("svg")
          .attr("width", width + margin.left + margin.right + 120)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
      
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y).tickSize(-width*1.3).ticks(7)) 
      .selectAll("text")
       .style("font-size", "1.6em")
    
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width + margin.right]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    
    svg.selectAll(".tick line").attr("stroke", "#DCDFE3")

    svg.selectAll("text")
      .style("font-size", "1.6em")

      

    svg.select(".domain").remove()
    
    var line = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", function(d, i){ return color(i)})
      .attr("stroke-width", 1.5)
      .attr("d", line)

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
    
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

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); mousemove(this) })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", function() { mousemove(this) });

    svg.select(".focus circle").style("fill", color(0))

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
  
    
})