d3.csv("US_Accidents_Dec21_updated.csv").then(function (data) {
        var attributes = [
                "Amenity",
                "Bump",
                "Crossing",
                "Give_Way",
                "Junction",
                "No_Exit",
                "Railway",
                "Station",
                "Stop",
                "Traffic_Calming",
                "Traffic_Signal",
                "Turning_Loop"
        ];

        var groupedData = attributes.map(function (attribute) {
                var trueData = data.filter(function (d) {
                        return d[attribute] === "TRUE";
                });

                var falseData = data.filter(function (d) {
                        return d[attribute] === "FALSE";
                });

                var avgSeverityTrue = d3.mean(trueData, function (d) {
                        return parseInt(d.Severity);
                });

                var avgSeverityFalse = d3.mean(falseData, function (d) {
                        return parseInt(d.Severity);
                });

                return [
                        {
                                attribute: attribute,
                                value: "True",
                                avgSeverity: avgSeverityTrue || 0
                        },
                        {
                                attribute: attribute,
                                value: "False",
                                avgSeverity: avgSeverityFalse || 0
                        }
                ];
        });

        // Set the dimensions and margins of the graph
        var margin = { top: 20, right: 20, bottom: 70, left: 80 };
        var width = 1200 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        // Append the SVG object to the chart div
        var svg = d3
            .select("#barchartduo")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add the console.log statements here
        console.log(groupedData);

        groupedData.forEach(function (data) {
                data.forEach(function (d) {
                        console.log(d);
                });
        });

        var xScale = d3
            .scaleBand()
            .domain(attributes)
            .range([0, width])
            .padding(0.3); // Adjust the padding value for spacing between the bars

        var yScale = d3
            .scaleLinear()
            .domain([0, d3.max(groupedData.flat(), (d) => d.avgSeverity)])
            .range([height, 0]);

        var attributeBars = svg
            .selectAll("g")
            .data(groupedData)
            .enter()
            .append("g")
            .attr("transform", function (d, i) {
                    return "translate(" + (xScale(attributes[i]) + xScale.bandwidth() / 2) + ",0)";
            });

        attributeBars
            .selectAll("rect")
            .data(function (d) {
                    return d;
            })
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                    return i === 0 ? -xScale.bandwidth() / 2 : 0;
            })
            .attr("y", function (d) {
                    return yScale(d.avgSeverity);
            })
            .attr("width", xScale.bandwidth() / 2)
            .attr("height", function (d) {
                    return height - yScale(d.avgSeverity);
            })
            .attr("fill", function (d) {
                    return d.value === "True" ? "#1f77b4" : "#ff7f0e";
            });


        svg
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));
        svg
            .append("g")
            .call(d3.axisLeft(yScale));

        svg
            .append("text")
            .attr("class", "x-label")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .style("text-anchor", "middle")
            .text("Attribute");

        svg
            .append("text")
            .attr("class", "y-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 10)
            .style("text-anchor", "middle")
            .text("Average Severity");

        attributeBars
            .append("text")
            .attr("class", "attribute-label")
            .attr("x", xScale.bandwidth() / 2)
            .attr("y", function (d) {
                    return yScale(d.avgSeverity) - 5;
            })
            .attr("text-anchor", "middle")
            .text(function (d) {
                    return d.value;
            });

        var legend = svg
            .append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (width - 100) + "," + (height - 30) + ")");

        legend
            .append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "#1f77b4");

        legend
            .append("text")
            .attr("x", 15)
            .attr("y", 9)
            .text("True");

        legend
            .append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", 80)
            .attr("fill", "#ff7f0e");

        legend
            .append("text")
            .attr("x", 95)
            .attr("y", 9)
            .text("False");
});
