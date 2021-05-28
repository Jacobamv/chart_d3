var newData = {a: 9, b: 20, c:30, d:8, e:12}



var div = d3.select("main").append("div")
.style("opacity", 0)
.style("position", "absolute")
.style("text-align", "center")
.style("padding", ".5rem")
.style("background", "#fff")
.style("color", "#313639")
.style("border", "1px solid #313639")
.style("border-radius", "8px")
.style("pointer-event", "none")
.style("font-size", "1,3rem")

var width = 450
    height = 450
    margin = 40

var radius = Math.min(width, height) / 2 - margin

var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


var color = d3.scaleOrdinal()
  .domain(newData)
  .range(['#FF5967','#24CCB8','#FFD322','#FF8B8B','#70CCFF','#AE7EFC','#8EE765','#89A8F4','#FE9A6F'])

function update(data, f) {

  var total = 0;

  for (var property in newData) {
    total += newData[property];
  }

  var pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(function(a, b) {return d3.ascending(a.key, b.key);} )
  var data_ready = pie(d3.entries(data))

  var u = svg.selectAll("path")
    .data(data_ready)
    .on("mouseover", function(d){
      d3.select(this).transition()
        .duration('300')
        .attr('opacity', '.85')
        .attr('d', d3.arc()
          .innerRadius(0)
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
        .duration('300')
        .attr('opacity', '1')
        .attr('d', d3.arc()
          .innerRadius(0)
          .outerRadius(radius)
        )
      div.transition()
        .duration('50')
        .style("opacity", 0);
    })
    

  u
    .enter()
    .append('path')
    .merge(u)
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)
    
    

  u.selectAll("path")
    .transition()
    .duration(800)
    .delay(function(d,i){return(i*100)})
  

    if(f == 0){
      update(data, 1);
    }
}

update(newData, 0)