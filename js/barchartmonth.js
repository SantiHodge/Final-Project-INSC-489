// Load the data
d3.csv("US_Accidents_Dec21_updated.csv").then(function(data) {
    // Filter out null months
    data = data.filter(d => d.Start_Time !== "" && d.Start_Time !== null);

    // Count the number of entries for each month
    var counts = d3.rollup(data, v => v.length, d => new Date(d.Start_Time).getMonth() + 1);
    var countArray = Array.from(counts, ([key, value]) => ({month: key, count: value}));

    // Set up the chart
    var margin = {top: 50, right: 20, bottom: 70, left: 70},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .domain(countArray.filter(d => !isNaN(d.month)).sort((a, b) => a.month - b.month).map(d => d.month))
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(countArray, d => d.count)])
        .range([height, 0]);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the bars to the chart
    svg.selectAll(".bar")
        .data(countArray.filter(d => !isNaN(d.month)))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.month))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.count))
        .attr("height", d => height - y(d.count))
        .attr("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)]);

    // Add the x axis to the chart
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", margin.bottom / 1.5)
        .text("Month of the Year");

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
        .attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom/2) + ")")
        .style("text-anchor", "middle")
        .text("Month of the Year");

    // Add the y axis label to the chart
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Total Number of Crashes");

});
