var marginBar = {top: 30, right: 30, bottom: 70, left: 60},
    widthBar = 660 - marginBar.left - marginBar.right,
    heightBar = 600 - marginBar.top - marginBar.bottom;

var svgBar = d3.select("#barChart")
  .append("svg")
    .attr("width", widthBar + marginBar.left + marginBar.right)
    .attr("height", heightBar + marginBar.top + marginBar.bottom)
  .append("g")
    .attr("transform",
          "translate(" + marginBar.left + "," + marginBar.top + ")");

d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv", function(data) {

  data.sort(function(b, a) {
    return a.Value - b.Value;
  });

var y = d3.scaleLinear()
    .domain([0, 13000])
    .range([ heightBar, 0]);
svgBar.append("g")
    .call(d3.axisLeft(y).tickSize(-width*1.3).ticks(7))
    .selectAll("text")
        .style("font-size", "1.6em")

  var x = d3.scaleBand()
    .range([ 0, widthBar ])
    .domain(data.map(function(d, i) { return d.Country; }))
    .padding(0.3);
  svgBar.append("g")
    .attr("transform", "translate(0," + heightBar + ")")
    .call(d3.axisBottom(x))
    .selectAll(".tick").remove()

svgBar.select(".domain").remove()

var colorBar = d3.scaleOrdinal()
    .range(['#FF5967','#24CCB8','#FFD322','#FF8B8B','#70CCFF','#AE7EFC','#8EE765','#89A8F4','#FE9A6F']);
      
svgBar.selectAll(".tick line").attr("stroke", "#DCDFE3")
  svgBar.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
        .attr("x", function(d) { return x(d.Country); })
        .attr("y", function(d) { return y(d.Value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return heightBar - y(d.Value); })
        .attr("fill", function(d, i){;  return(colorBar(i % 3)); })
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
            let country = d.Country
            div.html(country + "<br />" + d.Value + "$")
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
})