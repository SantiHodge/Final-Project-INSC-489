// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2;

// Color scale for the slices
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// append the svg object to the chart div
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

d3.csv("US_Accidents_Dec21_updated.csv").then(function(data) {
    // filter the data to keep only the relevant columns and extract the hour data
    data = data.map(function(d) {
        var startTime = new Date(d.Start_Time);
        var hour = startTime.getHours();
        return hour;
    });

    // group the data by hour and count the number of crashes for each hour
    var hourData = d3.group(data, d => d);
    var hourDataCount = Array.from(hourData, ([hour, data]) => ({
        hour: +hour,
        count: data.length
    }));

    // Compute the total count of crashes
    var totalCount = d3.sum(hourDataCount, d => d.count);

    // Sort the data in descending order of count
    hourDataCount.sort((a, b) => b.count - a.count);

    // Create the pie layout
    var pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    // Generate the arc paths based on the pie data
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Create the pie chart slices
    var slices = svg.selectAll(".slice")
        .data(pie(hourDataCount))
        .enter()
        .append("path")
        .attr("class", "slice")
        .attr("fill", (d, i) => colorScale(d.data.hour))
        .attr("d", arc);

    // Add labels for each hour
    var labels = svg.selectAll(".label")
        .data(pie(hourDataCount))
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("transform", d => {
            var centroid = arc.centroid(d);
            return "translate(" + centroid[0] + "," + centroid[1] + ")";
        })
        .attr("text-anchor", "middle")
        .text(d => {
            var percentage = (d.data.count / totalCount * 100).toFixed(1);
            return d.data.hour + " (" + percentage + "%)";
        })
        .style("font-size", "12px")
        .style("font-weight", "bold");

});

