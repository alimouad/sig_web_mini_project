var osmMap = L.tileLayer.provider('OpenStreetMap.Mapnik');
var stamenMap = L.tileLayer.provider('Stamen.Watercolor');
var imageryMap = L.tileLayer.provider('Esri.WorldImagery');

var baseMaps = {
    OSM: osmMap,
    'Stamen Watercolor': stamenMap,
    'World Imagery': imageryMap
};

var geoServerIPPort = "10.96.4.34:8081";
var geoServerWorkspace = "Torrent";
var stateLayerName = "Torrent:ind_st";

var indiaStLayer = L.tileLayer.wms(
    "http://" + geoServerIPPort + "/geoserver/" + geoServerWorkspace + "/wms",
    {
        layers: stateLayerName,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        tiled: false,
    }
);

var overlayMaps = {
    "India States": indiaStLayer,
};

var map = L.map("map", {
    center: [22.735656852206496, 79.89257812500001],
    zoom: 5,
    layers: [osmMap, indiaStLayer]
});

var mapLayers = L.control.layers(baseMaps, overlayMaps).addTo(map);

ctlMeasure = L.control
    .polylineMeasure({
        position: "topleft",
        measureControlTitle: "Measure Length",
    })
    .addTo(map);