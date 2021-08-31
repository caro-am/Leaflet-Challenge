// JSON url
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log(queryUrl)

// markers
function markerSize(magnitude) {
    return magnitude * 5;
}

function markerColor(magnitude) {
  if (magnitude > 4) {
    return '#fc0b03'
  } else if (magnitude > 3) {
    return '#fc9003'
  } else if (magnitude > 2) {
    return '#ebfc03'
  } else {
    return '#03fc90'
  }
}


// magnitude
function markerOpacity(magnitude) {
  if (magnitude > 6) {
    return .99}
  else if (magnitude > 5) {
    return .80
  } else if (magnitude > 4) {
    return .70
  } else if (magnitude > 3) {
    return .60
  } else if (magnitude > 2) {
    return .50
  } else if (magnitude > 1) {
    return .40
  } else {
    return .30
  }
}

// query url 
d3.json(queryUrl).then(function(data) {

    let earthquakes = L.geoJSON(data.features, {
        onEachFeature : addPopup,
        pointToLayer: addMarker
      });
    
// creating map
createMap(earthquakes);

});

function addMarker(feature, location) {
  let options = {
    stroke: false,
    fillOpacity: markerOpacity(feature.properties.mag),
    color: markerColor(feature.properties.mag),
    fillColor: markerColor(feature.properties.mag),
    radius: markerSize(feature.properties.mag)
  }

  return L.circleMarker(location, options);

}

 function addPopup(feature, layer) {
    return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <h4>Magnitude: ${feature.properties.mag} </h4> <p> ${Date(feature.properties.time)} </p>`);}
function createMap(earthquakes) {



// streetmap and darkmap layers
    let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      })
  
    let darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
      });
  
    // baseMaps object to hold layers
    let baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };

    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    let myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
//the legend
    let legend = L.control({
        position: 'bottomright'
    });

    legend.onAdd = function () {
    
        let div = L.DomUtil.create('div', 'info legend')
        let grades = [1, 2, 3, 4];
        let colors = [
            '#fc0b03', 
            '#fc9003', 
            '#ebfc03', 
            '#03fc90'
        ];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
              "<i style='background: " + colors[i] + "'></i> " +
              grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
          }
          return div;
    };
    
//add ledgend to map     
    legend.addTo(myMap);

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  }