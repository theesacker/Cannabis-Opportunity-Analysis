d3.json("county_sales").then(function (data) {
    var config = { responsive: true };
    // First chart
    data.sort(function (a, b) {
        return parseFloat(b.personal_income) - parseFloat(a.personal_income)
    });

    var incomeCountyNames = data.map(county => county.county);
    var totalIncome = data.map(county => county.personal_income);



    var incomeData = [{
        x: incomeCountyNames,
        y: totalIncome,
        text: data.map(county => "Population: " + county.population + "<br />Dispensary Count: " + county.dispensary_count + "<br />Dispensaries over Population: " + county.population_per_dispensary),
        name: "Total Income per County",
        type: "bar"
    }];
    var incomeLayout = {
        title: "Total Income per County",
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        },
        xaxis: {
            title: {
                text: "County"
            }
        },
        yaxis: {
            title: {
                text: "Total Income"
            }
        }
    };
    Plotly.newPlot("income-bar", incomeData, incomeLayout, config);

    // Second chart
    var totalSales = data.map(county => county.sales);

    var incomeData = [{
        x: incomeCountyNames,
        y: totalSales,
        text: data.map(county => "Population: " + county.population + "<br />Dispensary Count: " + county.dispensary_count + "<br />Dispensaries over Population: " + county.population_per_dispensary),
        name: "Total Sales per County",
        type: "bar"
    }];
    var incomeLayout = {
        title: "Total Sales per County",
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        },
        xaxis: {
            title: {
                text: "County"
            }
        },
        yaxis: {
            title: {
                text: "Total Spent"
            }
        }
    };


    Plotly.newPlot("sales-bar", incomeData, incomeLayout, config);
    // Third chart
    var countyNames = data.map(county => county.county);
    var avg_sale_dispo_per_capita = data.map(county => Math.round(county.avg_sale_dispo_per_capita, 2));
    var salesPerCapita = data.map(county => Math.round(county.sales_per_capita, 2));

    var avg_dispo_cap_data = {
        x: countyNames,
        y: avg_sale_dispo_per_capita,
        text: data.map(county => "Average Sales per Dispensary per Capita: $" + county.avg_sale_dispo_per_capita + "<br />Dispensary Count: " + county.dispensary_count + "<br />Population per Dispensary: " + county.population_per_dispensary),
        name: "Average Sales Per Dispensary per Capita",
        type: "bar"
    };
    var salesPerCapitaTrace = {
        x: countyNames,
        y: salesPerCapita,
        text: data.map(county => "Sales per Capita: $" + Math.round(county.sales_per_capita) + "<br />Sales: $" + county.sales + "<br />Population: " + county.population),
        name: "Sales per Capita",
        type: "bar"
    };

    var thirdChartData = [avg_dispo_cap_data, salesPerCapitaTrace]
    var layout = {
        title: "Average Sales Per Dispensary per Capita",
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        },
        showlegend: true,
        legend: {
            x: 1,
            xanchor: 'right',
            y: 1
        },
        xaxis: {
            title: {
                text: "County"
            }
        },
        yaxis: {
            title: {
                text: "Dollars"
            }
        }
    };
    Plotly.newPlot("bar-one", thirdChartData, layout, config);


    // Fourth chart

    var avgSalesCountyNames = data.map(county => county.county);
    var avgSalesPerDispensary = data.map(county => county.avg_sales_per_dispensary);


    var avgSalesPerDispensaryData = [{
        x: avgSalesCountyNames,
        y: avgSalesPerDispensary,
        text: data.map(county => "Average Sales: $" + county.avg_sales_per_dispensary + "<br />Total Sales: $" + county.sales + "<br />Dispensary Count: " + county.dispensary_count),
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
        },
        xaxis: {
            title: {
                text: "County"
            }
        },
        yaxis: {
            title: {
                text: "Average Sales"
            }
        }
    };
    Plotly.newPlot("bar-two", avgSalesPerDispensaryData, avgSalesPerDispensaryLayout, config);




});
