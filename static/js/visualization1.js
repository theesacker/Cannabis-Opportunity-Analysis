// Store our API endpoint inside queryUrl
var lineQuery = "/yearly_sales"

d3.json(lineQuery).then(function (data) {
  // var nineSales = data.nineSales
  console.log(data);
  // var salesData = data;
  data.forEach(function(salesMonth){
    var nine = Math.round(salesMonth.nine_sales, 2);
    var twenty = Math.round(salesMonth.twenty_sales ,2);
    console.log(nine);
    console.log(twenty);
    // var nineDates = 
  })


});
