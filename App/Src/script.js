window.addEventListener('load', () => {
    setTimeout(() => {
        let loader = document.querySelector('.loader')
        loader.style.display = 'none'
    }, 1000)

})

// adding map view/////
const myMap = L.map("map", {
    crs: L.CRS.EPSG3857
    // crs: crs,
}).setView([30.386, -3.319], 5);



// define morocco projection/////
let popup = L.popup({
    offset: [0, -10]
});
let marker;



// letiables////
let baseMaps;
let overlays;
let mycrlocation;
let mouseCoord;
let polyMesure;
let easyBtn;
let curreLocation;
let ctlStyle;
let moroccoBou;
let lyrGoogleMap;
let lyrGoogleHybrid;
let osmMap;
let imageryMap;
let googleSat;
let geoData;
let selected;
let layerControl;
let drawnFeatures
let geoLayer;

let items = [];
let data





// define tileLayer/////

lyrGoogleMap = L.tileLayer('http://mts3.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 22,
    maxNativeZoom: 20
})
lyrGoogleHybrid = L.tileLayer('http://mts2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 25,
    maxNativeZoom: 20
})
googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(myMap);


// Esri map////
const apiKey = "AAPKbb4968d70d7242ea8952170a417c2c79m1C8xvuIpsv9iLAVd66RXaUZet3HWYwgcC42-UUVejxrd540jO3Qz7OJho114pJL";

let EsriMap = L.esri.Vector.vectorBasemapLayer("ArcGIS:Navigation", {
    apikey: apiKey
});

// join all layer in layerControl/////
baseMaps = {
    "Esri Map": EsriMap,
    "Google-sat": googleSat,
    "Google-Map": lyrGoogleMap,
    "Google-Hybrid": lyrGoogleHybrid
};





overlays = L.layerGroup()
drawnFeatures = new L.FeatureGroup();
// overlays.addLayer(moroccoBou,'morocc - boundaries');
layerControl = L.control.layers(baseMaps).setPosition('topright').addTo(myMap);
// layerControl.addOverlay(moroccoBou,"maroc");
layerControl.addOverlay(drawnFeatures, "drawn");

// Leaflet Pluguins////////////
// **********************************

// geocoder////////////
L.Control.geocoder({
    position: 'topleft'
}).addTo(myMap);

// Distance and area measurement
L.control.measure({
    // collapsed: false,
    title: "Surface Measurement"
}).addTo(myMap);


// current Locations////
curreLocation = L.control.locate({
    // position: "topright",
    flyTo: true,  /// smouth action
    circleStyle: {
        radius: 19
    },
    strings: {
        title: "locate"
    },
    showPopup: true
}).addTo(myMap);




// print pluguins////
let customActionToPrint = function (context, mode) {
    return function () {
        window.alert("We are printing the MAP. Let's do Custom print here!");
        context._printMode(mode);
    }
};
// Browser Print options
let options = {
    documentTitle: 'GeoMap Print',
    closePopupsOnPrint: false,
    manualMode: false,
    customPrintStyle: {
        color: "gray",
        dashArray: "5,10",
        weight: 2,
        pane: "customPrintPane"
    },
    printModes: [
        L.BrowserPrint.Mode.Landscape("Tabloid", { title: "Tabloid VIEW" }),

        L.BrowserPrint.Mode.Custom("A6", {
            title: "User defined print",
            action: customActionToPrint,
            invalidateBounds: false
        }),

        L.BrowserPrint.Mode.Landscape(),

        L.BrowserPrint.Mode.Portrait(),

        L.BrowserPrint.Mode.Auto("B4", { title: "Auto Print" }),

        L.BrowserPrint.Mode.Custom("B5", { title: "Select area" })
    ]
};

// Add the control to the map
let browserControl = L.control.browserPrint(options).addTo(myMap);





// Draw control/////////////

myMap.pm.addControls({
    positions: {
        draw: 'topright',
        edit: 'topright',
    },
    editControls: true,
    drawMarker: true,
    drawPolyline: true,
    drawCircle: false,
    drawText: true,
    drawCircleMarker: false,
    removalMode: true,
    rotateMode: false,
    layerGroup: drawnFeatures
});


// get image
L.control.bigImage({ position: 'topleft', inputTitle: 'Obtenir image' }).addTo(myMap);









const fileModal = document.getElementById("fileManagementModal");
const closeModalBtn = document.getElementById("closeFileManagementModal");
const importSection = document.getElementById("importSection");
const exportSection = document.getElementById("exportSection");
const infoFile = document.querySelector('#infoModal')
const infoBbtn = document.querySelector('#toggleInfo')

// Open modal helper
function openModal(highlight) {
    importSection.classList.remove("ring-2", "ring-indigo-500");
    exportSection.classList.remove("ring-2", "ring-indigo-500");

    if (highlight === "import") {
        importSection.classList.add("ring-2", "ring-indigo-500", 'p-3', 'rounded-lg');
    } else if (highlight === "export") {
        exportSection.classList.add("ring-2", "ring-indigo-500", 'p-3', 'rounded-lg');
    }

    fileModal.classList.remove("hidden");
}

// Close modal helper
function closeModalSearch() {
    fileModal.classList.add("hidden");
}

// Event bindings
document.getElementById("openImportModal").addEventListener("click", () => {
    openModal("import");
});

document.getElementById("openExportModal").addEventListener("click", () => {
    openModal("export");
});

closeModalBtn.addEventListener("click", closeModalSearch);
//close if clicking outside modal content
fileModal.addEventListener("click", (e) => {
    if (e.target == fileModal) {
        closeModalSearch();
    }
});

infoBbtn.addEventListener('click', () => {
    infoFile.classList.remove('hidden');
})

infoFile.addEventListener("click", (e) => {
    if (e.target == infoFile) {
        closeModalSearch();
    }
});




// show legends--------------
const fileItems = document.querySelectorAll('.item');
const deleteItems = document.querySelectorAll('.delete-item');

fileItems.forEach(item => {
    const fileNameEl = item.querySelector('.file-name');

    fileNameEl.addEventListener('click', () => {
        if (item.classList.contains('geojson') && geoData) {
            myMap.flyToBounds(geoData.getBounds());
        }
    });
});

deleteItems.forEach(delBtn => {
    delBtn.addEventListener('click', e => {
        e.preventDefault(); // prevent link navigation
        const item = delBtn.closest('.item');
        if (!item) return;

        // Ask the user
        const confirmDelete = confirm("Do you really want to remove this layer?");
        if (!confirmDelete) return;
        item.classList.add('hidden');

        // Remove from map & control
        if (item.classList.contains('geojson') && geoData) {
            myMap.removeLayer(geoData);
            layerControl.removeLayer(geoData);
            geoData = null;
        }
         if (item.classList.contains('morocco') && moroccoBou) {
            myMap.removeLayer(moroccoBou);
            layerControl.removeLayer(moroccoBou);
            moroccoBou = null;
        }
          if (item.classList.contains('shapefile') && geoLayer) {
            myMap.removeLayer(geoLayer);
            layerControl.removeLayer(geoLayer);
            geoLayer = null;
        }
    });
});

function handleFileUpload(file, fileType, layer) {
    // Select the corresponding item dynamically
    const item = document.querySelector(`.item.${fileType}`);
    const filesItems = document.querySelector('.listFiles')
    const fileNameEl = item.querySelector('.file-name');

    filesItems.classList.remove('hidden');
    item.classList.remove('hidden');
    fileNameEl.textContent = file.name ? file.name : "GeoServer Layer";


    if (layer) {
        myMap.flyToBounds(layer.getBounds(), { padding: [12, 12] });
        layerControl.addOverlay(layer, file.name);
    }
}


document.getElementById('geojson-file').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {

    if (geoData) {
        overlays.clearLayers();
        layerControl.removeLayer(geoData);
        myMap.removeLayer(geoData);
    }

    const file = event.target.files[0];
    if (!file || file.name.slice(-8).toLowerCase() !== '.geojson') {
        alert('Please select a valid GeoJSON file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = JSON.parse(e.target.result);

        geoData = L.geoJson(data, {
            onEachFeature: onEachFeature
        }).addTo(myMap);

        handleFileUpload(file, 'geojson', geoData);


        alert('The file was uploaded successfully');
    };
    reader.readAsText(file);
}

function onEachFeature(feature, layer) {
    if (feature.properties) {

        let popupHtml = `
            <div class="p-2 font-sans">
                <h4 class="text-emerald-600 font-black uppercase text-[10px] tracking-widest mb-3 border-b border-slate-100 pb-2">
                    Feature Details
                </h4>
                <table class="w-full text-xs">
                    <tbody>
        `;

        for (const [key, value] of Object.entries(feature.properties)) {
            const formattedKey = key.replace(/_/g, ' ').toUpperCase();

            popupHtml += `
                <tr class="border-b border-slate-50 last:border-0">
                    <td class="py-1.5 pr-4 font-bold text-slate-400 text-[9px] uppercase tracking-tight">${formattedKey}</td>
                    <td class="py-1.5 font-semibold text-slate-700 text-right">${value || 'N/A'}</td>
                </tr>
            `;
        }

        popupHtml += `
                    </tbody>
                </table>
            </div>
        `;

        layer.bindPopup(popupHtml, {
            closeButton: true,
            maxWidth: 300,
            className: 'custom-map-popup'
        });
        layer.on({
            mouseover: function (e) {
                const layer = e.target;
                layer.setStyle({
                    weight: 3,
                    color: '#10b981',
                    fillOpacity: 0.7
                });
            },
            mouseout: function (e) {
                layer.setStyle({ weight: 2, color: '#753a88', fillOpacity: 0.2 });
            }
        });
    }
}


// file imported styling/////////////////////
function Ethnic1Style() {
    return {
        fillColor: 'rgb(145, 228, 0)',
        weight: 3,
        opacity: 1,
        color: 'rgb(145, 228, 0)',
        dashArray: '1',
        fillOpacity: 0.2
    };
}
function Ethnic2Style() {
    return {
        fillColor: '#753a88',
        weight: 3,
        opacity: 1,
        color: '#753a88',
        dashArray: '1',
        fillOpacity: 0.2
    };
}


// choose styling to imported file//////////////
let colors = document.querySelectorAll('.cont>div')
colors.forEach((color) => {
    color.addEventListener('click', (event) => {
        let target = event.target.id
        if (geoData) {
            geoData.setStyle(Ethnic1Style(target));

        }
        else {
            return null
        }

    })
})


// --- Utility: Download ---
function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}

// --- EXPORT GEOJSON ---
document.getElementById("exportgeo").addEventListener("click", () => {
    if (drawnFeatures.getLayers().length === 0) {
        alert("No features to export!");
        return;
    }
    const geojsonData = drawnFeatures.toGeoJSON();

    if (geojsonData) {
        downloadFile(
            JSON.stringify(geojsonData, 'saved_file', 2),
            "drawn_features.geojson",
            "application/json"
        );
    }
});



// get data from geoserver WFS/////
let wfsUrl = "http://localhost:8080/geoserver/sig_web/ows?" +
    "service=WFS&version=1.0.0&request=GetFeature&typeName=sig_web:states&outputFormat=application/json";

fetch(wfsUrl)
    .then(response => response.json())
    .then(data => {
        geoLayer = L.geoJson(data, {
            onEachFeature: onEachFeature,
            style: Ethnic2Style,
        }).addTo(myMap);
        handleFileUpload(data, 'shapefile', geoLayer);
        myMap.fitBounds(geoLayer.getBounds(), { padding: [12, 12] });
    })
    .catch(error => console.error('Error fetching GeoJSON:', error));


let moroccoGeoJson = 'data/morocco_id.geojson';
fetch(moroccoGeoJson)
    .then(response => response.json())
    .then(data => {
        moroccoBou = L.geoJson(data, {
            style: Ethnic1Style,
            onEachFeature: onEachFeature
        }).addTo(myMap);
        layerControl.addOverlay(moroccoBou, "Morocco Boundaries");
        handleFileUpload(data, 'morocco', moroccoBou);

    })
    .catch(error => console.error('Error fetching Morocco GeoJSON:', error));



// saved file to localStorage;----
myMap.on("pm:create", (e) => {
    drawnFeatures.addLayer(e.layer);
    const geojsonData = drawnFeatures.toGeoJSON();
    localStorage.setItem("savedFile", JSON.stringify(geojsonData));

});
// Restore drawing Data*********
document.addEventListener("DOMContentLoaded", () => {
    const savedGeoJSON = localStorage.getItem("savedFile");
    const restoreModal = document.getElementById("restoreModal");

    if (savedGeoJSON && restoreModal) {
        restoreModal.classList.remove("hidden");

        // Handle buttons inside modal
        document.getElementById("cancelRestore").addEventListener("click", () => {
            restoreModal.classList.add("hidden");
            localStorage.removeItem("savedFile");
        });

        document.getElementById("confirmRestore").addEventListener("click", () => {
            restoreModal.classList.add("hidden");
            restoreDrawnItems(); // 🔹 restore features to map
        });
    }
});

// Hide modal function
function hideRestoreModal() {
    const modal = document.getElementById("restoreModal");
    if (modal) modal.classList.add("hidden");
}

// Restore features from localStorage
function restoreDrawnItems() {
    const savedGeoJSON = localStorage.getItem("savedFile");
    if (savedGeoJSON) {
        const geojsonData = JSON.parse(savedGeoJSON);

        // Add it back to map
        L.geoJSON(geojsonData, {
            onEachFeature: (feature, layer) => {
                layer.bindPopup("Restored Feature");
            },
            style: Ethnic2Style,
        }).addTo(myMap);

    }
}

