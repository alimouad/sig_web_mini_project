// variables
var myMap;
var lyrOSM;
var lyrImagery;
var lyrTopoMap;
var objBaseMap;
var ObjOverlays;
var lyrBasemap;
var ctlDraw;
var fgDrawItems;
var ctlStyle;
var ctlPan;
var ctlZoomslider;
var ctlMousePosition;
var ctlMeasure;
var ctlEasyButton;
var ctlSidebar;
var lyrTrees;
var lyrClusterTrees;
var lyrBoundary;
var lyrIrrigation;
var lyrFields;
var lyrStreets;
var iconTreesOne;
var iconTreesTwo;
var lyrGoogleMap;
var lyrGoogleHybrid;




$(document).ready(function () {
    // create map object
    myMap = L.map('map_div',  {center:[29.66395,72.63821], zoom:17, zoomControl:false });

    // icons for feature layer
    // iconTreesOne = L.AwesomeMarkers.icon({icon:'tree', markerColor: 'red', iconColor:'white', prefix: 'fa'});
    // iconTreesTwo = L.AwesomeMarkers.icon({icon:'leaf', markerColor: 'green', iconColor:'red', prefix: 'fa', spin: true});

    //add basemap layer

    lyrGoogleMap = L.tileLayer('http://mts3.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom:22,
        maxNativeZoom:18
    })

    lyrGoogleHybrid = L.tileLayer('http://mts2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',{
        maxZoom:22,
        maxNativeZoom:18
    })


    // lyrOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
    lyrOSM     = L.tileLayer.provider('OpenStreetMap.Mapnik') ;
    lyrImagery = L.tileLayer.provider('Esri.WorldImagery') ;
    lyrTopoMap = L.tileLayer.provider('OpenTopoMap') ;
    lyrBasemap  = L.imageOverlay('img/fields.png', [[29.66542,72.63678],[29.66320,72.64034]], {opacity:1}).addTo(myMap);
    myMap.addLayer(lyrGoogleHybrid);


    // feature groups

    fgDrawItems = new L.featureGroup().addTo(myMap);
    lyrClusterTrees = L.markerClusterGroup();


    // Feature layers
    lyrBoundary = L.geoJSON.ajax('data/boundary.geojson', {color:'pink', weight:10, fillOpacity:0}).addTo(myMap);
    lyrFields     = L.geoJSON.ajax('data/fields.geojson',{style:FunStyleFields, onEachFeature:funLabelFeatures}).addTo(myMap);
    lyrIrrigation = L.geoJSON.ajax('data/irrigation_lines.geojson',{color:'blue', dashArray:"4,10", weight:10}).addTo(myMap);
    lyrStreets    = L.geoJSON.ajax('data/streets.geojson',{color:'orange', dashArray:"3,10", weight:5}).addTo(myMap);
    lyrTrees = L.geoJSON.ajax('data/trees.geojson', { pointToLayer: funReturnTrees });
    
    lyrTrees.on('data:loaded', function () {
        myMap.fitBounds(lyrTrees.getBounds());
        lyrClusterTrees.addLayer(lyrTrees);
        lyrClusterTrees.addTo(myMap);

    })

    // layers setup control
    objBaseMap = {
        "OpenStreetMap" :lyrOSM,
        "Esri-WorldImagery" :lyrImagery,
        "OpenTopoMap" :lyrTopoMap,
        "Google-Map":lyrGoogleMap,
        "Google-Hybrid":lyrGoogleHybrid
    }

    ObjOverlays ={
        "Draw Items": fgDrawItems,
        "TreeCluster" : lyrClusterTrees,
        "Streets" : lyrStreets,
        "Irrigation" : lyrIrrigation,
        "Fields" : lyrFields,
        "Boundary" : lyrBoundary,
        "BaseMAp":lyrBasemap
    }
    L.control.layers(objBaseMap, ObjOverlays).addTo(myMap);


    // plugins
    ctlPan = L.control.pan().addTo(myMap);
    ctlZoomslider = L.control.zoomslider({position:'topright'}).addTo(myMap);

    ctlMousePosition = L.control.mousePosition().addTo(myMap);
    ctlMeasure =L.control.polylineMeasure().addTo(myMap);

    ctlSidebar = L.control.sidebar('side-bar').addTo(myMap);
    ctlEasyButton = L.easyButton('fa-exchange', function(){
        ctlSidebar.toggle();
    }).addTo(myMap);


// new draw feature
    ctlDraw = new L.Control.Draw({
        edit:{
            featureGroup : fgDrawItems
        }
    });
    ctlDraw.addTo(myMap);

    myMap.on('draw:created',function (e) {
        fgDrawItems.addLayer(e.layer);
        alert(JSON.stringify(e.layer.toGeoJSON()));
    })

    ctlStyle = L.control.styleEditor({position:'topleft'}).addTo(myMap);
// end draw feature


    
    // tree feature functions
    // functions on Trees Layer
    function funReturnTrees(geoJsonPoint, latlng) {
        var att = geoJsonPoint.properties;
        if (att.type == 'Evergreen Trees'){
            var treeColor = 'green';
        } else if (att.type == 'Angiosperms'){
            var treeColor = 'red';
        }else {
            var treeColor = 'pink';
        }
        return L.circleMarker(latlng, {radius:10, color:treeColor})
            .bindTooltip("<h4>type:"+att.type+"</h4>")

    }


    // functions on Trees Layer
    function funReturnTrees(geoJsonPoint, latlng) {
        var att = geoJsonPoint.properties;
        switch (att.type) {

            case 'Evergreen Trees':
                var optTrees = {radius: 10, color:'deeppink',fillColor:'pink', fillOpacity:0.5 };
                break;
            case 'Banyan Tree':
                var optTrees = {radius: 13, color:'blue',fillColor:'blue', fillOpacity:0.5 };
                break;
            case 'Neem Tree':
                var optTrees = {radius: 10, color:'green',fillColor:'green', fillOpacity:0.5, dashArray:"2,8" };
                break;
            case 'Angiosperms':
                var optTrees = {radius: 20, color:'DarkOrange' ,fillColor:'DarkOrange', fillOpacity:0.5, dashArray:"2,8" };
                break;
            case 'Gymnosperms':
                var optTrees = {radius: 10, color:'DarkViolet' ,fillColor:'DarkViolet', fillOpacity:0.5, dashArray:"2,8", weight:7 };
                break;
            case 'Neem Tree':
                var optTrees = {radius: 20, color:'Lime' ,fillColor:'Lime', fillOpacity:0.5 };
                break;
            case 'Deciduous trees':
                var optTrees = {radius: 10, color:'YellowGreen' ,fillColor:'YellowGreen', fillOpacity:0.5 };
                break;
            case 'Neem Tree':
                var optTrees = {radius: 9, color:'Teal' ,fillColor:'Teal', fillOpacity:0.5 };
                break;
            case 'Peepal Tree':
                var optTrees = {radius: 10, color:'Cyan' ,fillColor:'Cyan', fillOpacity:0.5, weight:3 };
                break;
            case 'Aloe Vera Tree':
                var optTrees = {radius: 15, color:'DeepSkyBlue' ,fillColor:'DeepSkyBlue', fillOpacity:0.5 };
                break;
            case 'Amla Plant Tree':
                var optTrees = {radius: 10, color:'SaddleBrown' ,fillColor:'SaddleBrown', fillOpacity:0.5 };
                break;
            case 'Mahagony Tree':
                var optTrees = {radius: 10, color:'Maroon' ,fillColor:'Maroon', fillOpacity:0.5, weight:5 };
                break;
            case 'Sal Tree':
                var optTrees = {radius: 10, color:'DarkRed' ,fillColor:'DarkRed', fillOpacity:0.5 };
                break;
            case 'The Maple Tree':
                var optTrees = {radius: 15, color:'PaleVioletRed' ,fillColor:'PaleVioletRed', fillOpacity:0.5 };
                break;
            case 'Deciduous trees':
                var optTrees = {radius: 18, color:'Orange' ,fillColor:'Orange', fillOpacity:0.5};
                break;
            case 'Gymnosperms':
                var optTrees = {radius: 10, color:'Yellow' ,fillColor:'Yellow', fillOpacity:0.5 };
                break;
            case 'Neem Tree':
                var optTrees = {radius: 22, color:'Magenta' ,fillColor:'Magenta', fillOpacity:0.5 };
                break;
            case 'Peepal Tree':
                var optTrees = {radius: 12, color:'Purple' ,fillColor:'Purple', fillOpacity:0.5 };
                break;
            case 'Amla Plant Tree':
                var optTrees = {radius: 14, color:'LimeGreen' ,fillColor:'LimeGreen', fillOpacity:0.5 };
                break;
            case 'Evergreen Trees':
                var optTrees = {radius: 30, color:'Olive' ,fillColor:'Olive', fillOpacity:0.5 };
                break;
        }

        return L.circleMarker(latlng, optTrees)
            .bindTooltip("<h4>type:"+att.type+"</h4>");

    }


    // function funReturnTrees(geoJsonPoint, latlng) {
    //     var att = geoJsonPoint.properties;
    //         if (parseInt(att.gid) <= 100){
    //             var treeIcon = iconTreesOne;
    //         }else {
    //             var treeIcon = iconTreesTwo;
    //         }
    //     return L.marker(latlng, {icon:treeIcon})
    //         .bindTooltip("<h4>type:"+att.type+"</h4>");
    //
    // }

    // Field feature larye functions


    function FunStyleFields(json) {
        var att = json.properties
        switch (att.name) {
            case 'Rice':
                return {color :'yellow'};
                break;
            case 'Wheat':
                return {color :'peru'};
                break;
            case 'Peanut':
                return {color :'navy'};
                break;
            case 'Rye':
                return {color :'darkgreen'};
                break;
            case 'Lima Bean':
                return {color :'darkred'};
                break;
            case 'Safflower':
                return {color :'indigo'};
                break;
            case 'Reed Canary Grass':
                return {color :'darkgoldenrod'};
                break;
            case 'Tobacco':
                return {color :'deeppink'};
                break;
            default:
                return {color :'blue'};

        }
    }


    function funLabelFeatures(feature, layer) {

        var att = feature.properties;
        return layer.bindTooltip(att.name,{permanent:true, direction:"center"}).openTooltip();

    }





    // JQuery functions
    // get map zoom level
    myMap.on('zoomend', function () {
        $('#zoom_level_id').html(myMap.getZoom());
    });

    // get map zoom level
    myMap.on('moveend', function (e) {
        $('#map_center_id').html(latLngToString(myMap.getCenter()));
    });

    // get mouse location
    myMap.on('mousemove',function (e) {
        $('#mouse_location_id').html(latLngToString(e.latlng));

    });

    // set opacity on image
    $('#old-opacity').on('change', function () {
        $('#img-opacity').html(this.value);
        lyrBasemap.setOpacity(this.value);
    })



    //custom functions
    function latLngToString(ll) {
        return "["+ll.lat.toFixed(5)+","+ll.lng.toFixed(5)+"]";
    }





});
