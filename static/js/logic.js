var sMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var tph = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var base1 = {
    "Street View": sMap,
    "Topographic View": tph
};

let eqs = new L.LayerGroup();

var overlay = {
    Earthquakes: eqs
};

var newMap = L.map("map", {
    center: [51.0054907, -109.723717],
    zoom: 4,
    layers: [sMap, eqs]
});

L.control.layers(base1, overlay, {
    collapsed: false
}).addTo(newMap);




var qurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(qurl).then(function (data) {

function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: chooseColor(feature.properties.mag),
        color: "black",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
}


function chooseColor(mag) {
    if (mag > 5) {
        return "pink";
    }
    if (mag > 4) {
        return "red";
    }
    if (mag > 3) {
        return "orange";
    }
    if (mag > 2) {
        return "yellow";
    }
    if (mag > 1) {
        return "green";
    }
    return "blue"
}

function getRadius(mag) {
    if (mag === 0) {
        return 1;
    }
    return mag * 4;
}

L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
    },
style: styleInfo,

onEachFeature: function(feature, layer) {
    layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag} Location: ${feature.properties.place}</h3> <hr> <p>${new Date(feature.properties.time)}</p>`);
    }
}).addTo(eqs);
eqs.addTo(newMap);



legend.addTo(newMap);
});



