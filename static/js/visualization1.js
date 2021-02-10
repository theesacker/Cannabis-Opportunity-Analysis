var lineQuery = "/yearly_sales"

d3.json(lineQuery).then(function (data) {
    // var nineSales = data.nineSales
    console.log(data);
    var nine = data.map(month => month.nine_sales)
    var twenty = data.map(month => month.twenty_sales)
    var months = data.map(month => month.month)
    var config = {responsive: true};

    // console.log(nine);
    // console.log(twenty);
    // var months = salesMonth.month
    console.log(months);

    var monthNumber = {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12
    }
    var trace1 = {
        x: monthNumber[months],
        y: nine,
        type: "lines",
        mode: "lines+markers",
        name: "2019 Sales"

        // line: {
        //     color: "#17BECF"
        // }
    };
    var trace2 = {
        x: monthNumber[months],
        y: twenty,
        type: "lines",
        mode: "lines+markers",
        name: "2020 Sales"

        // line: {
        //     color: "#17BECF"
        // }
    };
    // The data array consists of both traces
    var data = [trace1, trace2];
    console.log(trace1);
    console.log(trace2);
    var layout = {
        title: "2019 to 2020 YOY Cannabis Sales",
        xaxis: {
            range: [0, 12]
        },
        yaxis: {
            autorange: true,
            type: "linear"
        }
    };
    console.log(d3.max(twenty))

    // This will use default parameters for the layout
    Plotly.newPlot("line-graph", data, layout, config);
});