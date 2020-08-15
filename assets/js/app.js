// @TODO: YOUR CODE HERE!
var svgWidth = 900;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Creates an SVG wrapper, appends an SVG group to hold our chart.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data.csv, loop through data, cast as numbers
d3.csv("assets/data/data.csv").then(function(censusData) {
  console.log(censusData[0])

  censusData.forEach(function(data) {
    data.obesity = +data.obesity;
    data.income = +data.income;
  });

  // Scaling
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.income)-1, d3.max(censusData, d => d.income)+1])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.obesity)-1, d3.max(censusData, d => d.obesity)+1])
    .range([height, 0]);

  // Axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append axes to chart group
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Create circles
chartGroup.selectAll("circle")	
    .data(censusData)
    .enter()
    .append("circle")			
    .attr("r", 12)		
    .attr("cx", d => xLinearScale(d.income))		 
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("fill", "blue")
    .attr("opacity", ".5")

    // Add state labels to circles
    var text = chartGroup.selectAll("g")
    .data(censusData)
    .enter()
    .append("g");

    text.append("text")
        .text(d => d.abbr)
        .attr("dx", (d => xLinearScale(d.income)-7))
        .attr("dy", (d => yLinearScale(d.obesity)+5))
        .attr("font-size", 10)
        .style('fill', 'white')
        .style("text-align","center")

    // Create axis labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 1.4))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% of Population that is Obese");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Income (In Thousands)");
  }).catch(function(error) {
    console.log(error);
  });