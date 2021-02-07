// Store our API endpoint inside queryUrl
var queryUrl = "../data/oregon_counties.geojson";
console.log("Hi")

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // The data.features object is in the GeoJSON standard
  console.log(data.features);

    // Do we need to concat our LatLng
  function pointToLayerFunc(feature, latlng) {
    var geojsonMarkerOptions = {
// FILL ME IN!!!
    };
    return L.circleMarker(latlng, geojsonMarkerOptions);
  }

  var counties = L.geoJSON(data.features, {
    onEachFeature: onEachFeatureFunc,
    pointToLayer: pointToLayerFunc
  });


    var worldmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "World Map": worldmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    counties: counties
  };
  

  // Create our map, giving it the satalite map and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [45.52, -122.67],
    zoom: 13,
    layers: [worldmap, counties]
  });


  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


})
