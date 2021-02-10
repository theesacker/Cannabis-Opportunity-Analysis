// Store our API endpoint inside queryUrl
var queryUrl = "static/data/oregon_counties.geojson";

var myMap = L.map("mapid", {
  center: [44., -120.67],
  zoom: 7
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
        fillColor: "blue",
        fillOpacity: 0.5,
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
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        }
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        // click: function (event) {
        //   myMap.fitBounds(event.target.getBounds());
        // }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h2>" + feature.properties.altname + " County</h2>");
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
  console.log(geoJson)
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
  console.log(geoJson)
  L.geoJson(geoJson, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng);
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
      ${feature.properties.county} County 
        <br> Sales: $${feature.properties.sales} 
        <br> Dispensary Count: ${feature.properties.dispensary_count}
        <br> Avg. Sales: $${feature.properties.avg_sales_per_dispensary}
        <br> Population: ${feature.properties.population}
        <br> Avg. Income: $${feature.properties.per_capita_income}
        <br> % of sales over Income: ${feature.properties.percent_of_sales_over_income}%
        `)
    }
  }).addTo(countySales);
});



// Linking Maps with Functions/Data
var baseMaps = {
  "World Map": worldmap,
  "Gray Scale" : greyscaleMap
};
var overlayMaps = {
  "Store": stores,
  "County Boundaries": countyArea,
  "County Data" : countySales
};


// add layer to control map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


