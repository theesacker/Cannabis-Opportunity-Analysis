d3.json("county_sales").then(function (data) {
    console.log(data);
    data.sort(function (a, b) {
        return parseFloat(b.avg_sale_dispo_per_capita) - parseFloat(a.avg_sale_dispo_per_capita)
    });
    var countyNames = data.map(county => county.county);
    var avg_sale_dispo_per_capita = data.map(county => Math.round(county.avg_sale_dispo_per_capita, 2));

    countyNames = countyNames.slice(0, 10);
    avg_sale_dispo_per_capita = avg_sale_dispo_per_capita.slice(0, 10);

    console.log(countyNames);
    console.log(avg_sale_dispo_per_capita);
    var avg_dispo_cap_data = [{
        x: countyNames,
        y: avg_sale_dispo_per_capita,
        text: avg_sale_dispo_per_capita,
        name: "Average Sales Per Dispensary per Capita",
        type: "bar"
    }];
    var layout = {
        title: "Average Sales Per Dispensary per Capita",
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };
    Plotly.newPlot("bar-one", avg_dispo_cap_data, layout);

    data.sort(function (a, b) {
        return parseFloat(b.avg_sales_per_dispensary) - parseFloat(a.avg_sales_per_dispensary)
    });

    var avgSalesCountyNames = data.map(county => county.county);
    var avgSalesPerDispensary = data.map(county => county.avg_sales_per_dispensary);

    avgSalesCountyNames = avgSalesCountyNames.slice(0, 10);
    avgSalesPerDispensary = avgSalesPerDispensary.slice(0, 10);


    var avgSalesPerDispensaryData = [{
        x: avgSalesCountyNames,
        y: avgSalesPerDispensary,
        text: data.map(county => "Average Sales: " + county.avg_sales_per_dispensary + "<br />Dispensary Count: " + county.dispensary_count),
        name: "Average Sales Per Dispensary",
        type: "bar"
    }];
    var avgSalesPerDispensaryLayout = {
        title: "Average Sales Per Dispensary",
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };
    Plotly.newPlot("bar-two", avgSalesPerDispensaryData, avgSalesPerDispensaryLayout);



});
