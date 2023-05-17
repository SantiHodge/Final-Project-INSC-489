// Load the data
d3.csv("US_Accidents_Dec21_updated.csv").then(function(data) {
    // Filter out null dates
// Filter out null dates and NaN values
    data = data.filter(d => d.Start_Time !== "" && d.Start_Time !== null && !isNaN(parseInt(d.Start_Time)));

// Parse date and count the number of entries for each month
    var counts = d3.rollup(
        data.sort((a, b) => d3.ascending(new Date(a.Start_Time), new Date(b.Start_Time))),
        v => v.length,
        d => d3.timeFormat("%B %Y")(new Date(d.Start_Time))
    );

    var countArray = Array.from(counts, ([key, value]) => ({month: key, count: value}))
        .filter(d => !isNaN(d.count));

    // Set up the chart
    var margin = {top: 50, right: 20, bottom: 70, left: 70},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .domain(countArray.map(d => d.month))
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(countArray, d => d.count)])
        .range([height, 0]);

    var line = d3.line()
        .x(d => x(d.month) + x.bandwidth() / 2)
        .y(d => y(d.count));

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Add the line to the chart
    svg.append("path")
        .datum(countArray)
        .attr("class", "line")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "1px");

    // Add the data points to the chart
    svg.selectAll("circle")
        .data(countArray)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.month) + x.bandwidth() / 2)
        .attr("cy", d => y(d.count))
        .attr("r", 3)
        .style("fill", "black");

    // Add the x axis to the chart
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add the y axis to the chart
    svg.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left / 1.5)
        .text("Total Number of Crashes");

// Add the x axis label to the chart
    svg.append("text")
        .attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom/2 + 35) + ")")
        .style("text-anchor", "middle")
        .text("Month and Year");


    // Add the y axis label to the chart
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left / 1.5)
        .style("text-anchor", "middle")
        .text("Total Number of Accidents Per Month");


});
