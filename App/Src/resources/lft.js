var osmMap = L.tileLayer.provider('OpenStreetMap.Mapnik');
var stamenMap = L.tileLayer.provider('Stamen.Watercolor');
var imageryMap = L.tileLayer.provider('Esri.WorldImagery');

var baseMaps = {
    'OSM': osmMap,
    'Stamen Watercolor': stamenMap,
    'World Imagery': imageryMap
};


var map = L.map("map", {
    center: [22.735656852206496, 79.89257812500001],
    zoom: 5,
    layers: [osmMap]
});
var latlngs = [
    [45.51, -122.68],
    [37.77, -122.43],
    [34.04, -118.2]
];

var polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);

// zoom the map to the polyline
map.fitBounds(polyline.getBounds());


// create a red polygon from an array of LatLng points
var latlngs = [[37, -109.05], [41, -109.03], [41, -102.05], [37, -102.04]];

var polygon = L.polygon(latlngs, { color: 'red', fillOpacity: 0.1 }).addTo(map);

// zoom the map to the polygon
map.fitBounds(polygon.getBounds());



var pointMarker = L.marker([23.435, 72.8337], {
    draggable : true,
}).addTo(map)
    .bindPopup('<h3>this is me a point marker</h3>')
    // .openPopup()



var ctlMeasure = L.control
    .polylineMeasure({
        position: "topleft",
        measureControlTitle: "Measure Length",
    })
    .addTo(map);



var overlayMaps = {
    "polygon": polygon,
    // "India States": indiaStLayer,
    "marker Layer": pointMarker
};
var mapLayers = L.control.layers(baseMaps,overlayMaps).addTo(map);