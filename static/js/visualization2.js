// Store our API endpoint inside queryUrl
var queryUrl = "static/data/oregon_counties.geojson";

var myMap = L.map("mapid", {
  center: [44., -120.67],
  zoom: 8
});

var worldmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var greyscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});



var stores = new L.layerGroup();
var countyArea = new L.layerGroup();
var countySales = new L.layerGroup();

d3.json(queryUrl).then(function (county) {

  // Creating a geoJSON layer with the retrieved data
  L.geoJson(county.features, {
    // Style each feature (in this case a neighborhood)
    style: function (feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: countyColor(feature.properties.sales),
        fillOpacity: 0.4,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function (feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.6
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.4
          });
        }
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        // click: function (event) {
        //   myMap.fitBounds(event.target.getBounds());
        // }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h3>" + feature.properties.altname + " County</h3><h3> Sales in 2019: $" + feature.properties.sales + "</h3>");
    }
  }).addTo(countyArea);
});

// Retail Map Function
var queryUrlRetail = "/retail_map";
d3.json(queryUrlRetail).then(function (data) {
  var jsonFeatures = [];
  data.forEach(function (store) {
    var lat = store.coords[0];
    var lon = store.coords[1];
    var feature = {
      type: 'Feature',
      properties: store,
      geometry: {
        type: 'Point',
        coordinates: [lon, lat]
      }
    };
    jsonFeatures.push(feature);
  })
  var geoJson = { type: 'FeatureCollection', features: jsonFeatures };
  L.geoJson(geoJson, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng);
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
      ${feature.properties.name} 
      <br>${feature.properties.address}
      `)
    }
  }).addTo(stores);
});

// County Data Map Function
var queryUrlCounty = "/county_sales";
d3.json(queryUrlCounty).then(function (data) {
  var jsonFeatures = [];
  data.forEach(function (sales) {
    var lat = sales.coords[0];
    var lon = sales.coords[1];
    var feature = {
      type: 'Feature',
      properties: sales,
      geometry: {
        type: 'Point',
        coordinates: [lon, lat]
      }
    };
    jsonFeatures.push(feature);
  })
  var geoJson = { type: 'FeatureCollection', features: jsonFeatures };
  L.geoJson(geoJson, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng);
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
      <strong>${feature.properties.county} County</strong> 
        <br> Sales: <strong>$${feature.properties.sales}</strong> 
        <br> Dispensary Count: <strong>${feature.properties.dispensary_count}</strong>
        <br> Avg. Sales: <strong>$${feature.properties.avg_sales_per_dispensary}</strong>
        <br> Population: <strong>${feature.properties.population}</strong>
        <br> Avg. Income: <strong>$${feature.properties.per_capita_income}</strong>
        <br> % of sales over Income: <strong>${feature.properties.percent_of_sales_over_income}%</strong>
        `)
    }
  }).addTo(countySales);

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // // code to try and make map legend
  // var legend = L.control({ position: 'bottomleft' });

  // legend.onAdd = function (map) {

  //   var div = L.DomUtil.create('div', 'info legend'),
  //     grades = [0, 500000, 1000000, 5000000, 10000000, 25000000, 50000000, 200000000],
  //     labels = [];

  //   // loop through our density intervals and generate a label with a colored square for each interval
  //   for (var i = 0; i < grades.length; i++) {
  //     div.innerHTML +=
  //       '<i style="background:' + depthColor(grades[i] + 1) + '"></i> ' +
  //       grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  //     console.log(grades[i])
  //     console.log(grades[i + 1])
  //   }

  //   return div;
  // };

  // legend.addTo(myMap);

});



// Linking Maps with Functions/Data
var baseMaps = {
  "World Map": worldmap,
  "Gray Scale": greyscaleMap
};
var overlayMaps = {
  "County Boundaries": countyArea,
  "Dispensaries": stores,
  "County Data": countySales
};


// // add layer to control map
// L.control.layers(baseMaps, overlayMaps, {
//   collapsed: false
// }).addTo(myMap);


function countyColor(county) {
  return county >= 200000000 ? '#63f542' :
    county >= 50000000 ? '#42f599' :
      county >= 25000000 ? '#42f5ec' :
        county >= 10000000 ? '#42adf5' :
          county >= 5000000 ? '#7534f7' :
            county >= 1000000 ? '#fa20f6' :
              county >= 500000 ? '#fa20a3' :
                '#fa2020';
};