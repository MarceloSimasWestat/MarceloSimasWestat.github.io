$(document).ready(function () {
    var elementaryLayer;
    var secondaryLayer;
    var tileIndex;
    var polygonLayer;
    var maxBounds = [[50, -52], [43, -135]]; //US bounds
    var leafletMap = L.map('map', {
        'center': [0, 0],
        'zoom': 10,
        'bounds': maxBounds
    }).fitBounds(maxBounds);

    L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ,<a href="http://mapbox.com/about/maps/">&copy;MapBox</a>',
        maxZoom: 16
    }).addTo(leafletMap);

    var tileOptions = {
        maxZoom: 20,  // max zoom to preserve detail on
        tolerance: 5, // simplification tolerance (higher means simpler)
        extent: 4096, // tile extent (both width and height)
        buffer: 64,   // tile buffer on each side
        debug: 0,      // logging level (0 to disable, 1 or 2)

        indexMaxZoom: 0,        // max zoom in the initial tile index
        indexMaxPoints: 100000 // max number of points per tile in the index
    };

    function loadNationalData() {
        secondaryLayer = L.geoJson(secondaryData, {
            onEachFeature: function (feature, layer) {
                var popup;
                if (layer.feature.properties['Absent Group'] <= 0) {
                    popup = "<b>" + layer.feature.properties['Name'] +
                        "</br><b>NO DATA</b>";
                } else {
                    popup = "<b>" + layer.feature.properties['Name'] +
                        "</b></br><b>Percent Absent: " + layer.feature.properties['Percent Absent'] + "</b>" +
                        "</b></br><b>Total Enrolled: " + layer.feature.properties['Total Enrolled'] + "</b>" +
                        "</b></br><b>Total Absent: " + layer.feature.properties['Total Absent'] + "</b>";
                }
                layer.bindPopup(popup);
            },
            style: function (feature) {
                return {
                    fillColor: getColor(feature.properties["Absent Group"]),
                    color: 'black',
                    weight: 0.5,
                    fillOpacity: 1,
                    opacity: 1
                };
            }
        });

        polygonLayer = L.geoJson(unifiedData);
        tileIndex = geojsonvt(unifiedData, tileOptions);
        colorizeFeatures(unifiedData);
        var tileLayer = L.canvasTiles().params({debug: false, padding: 5}).drawing(drawingOnCanvas);
        tileLayer.addTo(leafletMap);

        leafletMap.on('click', function (e) {
            var layer = leafletPip.pointInLayer([e.latlng.lng, e.latlng.lat], polygonLayer, true);
            var popup;
            if (layer.length) {
                if (layer[0].feature.properties['Absent Group'] <= 0) {
                    popup = "<b>" + layer[0].feature.properties['Name'] +
                        "</br><b>NO DATA</b>";
                    leafletMap.openPopup(popup, e.latlng);
                } else
                    popup = "<b>" + layer[0].feature.properties['Name'] +
                        "</b></br><b>Percent Absent: " + layer[0].feature.properties['Percent Absent'] + "</b>" +
                        "</b></br><b>Total Enrolled: " + layer[0].feature.properties['Total Enrolled'] + "</b>" +
                        "</b></br><b>Total Absent: " + layer[0].feature.properties['Total Absent'] + "</b>";
                leafletMap.openPopup(popup, e.latlng);
            }
        });
    }

    function colorizeFeatures(d) {
        for (var i = 0; i < d.features.length; i++) {
            d.features[i].properties.color = getColor(d.features[i].properties["Absent Group"]);
        }
    }

    //Set color based on group
    function getColor(d) {
        return d == 5 ? '#a63603' :
            d == 4 ? '#e6550d' :
                d == 3 ? '#fd8d3c' :
                    d == 2 ? '#fdae6b' :
                        d == 1 ? '#fdd0a2' :
                            '#808080'; // less than or equal to 0 is grey.
    }

    var pad = 0;
    //This function comes from http://bl.ocks.org/sumbera/c67e5551b21c68dc8299
    function drawingOnCanvas(canvasOverlay, params) {
        params.tilePoint.z = params.zoom;
        var ctx = params.canvas.getContext('2d');
        ctx.globalCompositeOperation = 'source-over';
        var tile = tileIndex.getTile(params.tilePoint.z, params.tilePoint.x, params.tilePoint.y);
        if (!tile) {
            return;
        }
        ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);
        var features = tile.features;
        ctx.strokeStyle = 'black';

        for (var i = 0; i < features.length; i++) {
            var feature = features[i],
                type = feature.type;
            ctx.fillStyle = feature.tags.color ? feature.tags.color : 'rgba(255,0,0,0.05)';
            ctx.beginPath();

            for (var j = 0; j < feature.geometry.length; j++) {
                var geom = feature.geometry[j];

                if (type === 1) {
                    ctx.arc(geom[0] * ratio + pad, geom[1] * ratio + pad, 2, 0, 2 * Math.PI, false);
                    continue;
                }

                for (var k = 0; k < geom.length; k++) {
                    var p = geom[k];
                    var extent = 4096;

                    var x = p[0] / extent * 256;
                    var y = p[1] / extent * 256;
                    if (k) ctx.lineTo(x + pad, y + pad);
                    else ctx.moveTo(x + pad, y + pad);
                }
            }
            if (type === 3 || type === 1) ctx.fill('evenodd');
            //ctx.globalAlpha = 0.5;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    loadNationalData();

    $('.elementary').click(function () {
        leafletMap.removeLayer(secondaryLayer);
        leafletMap.closePopup();
    });

    $('.secondary').click(function () {
        secondaryLayer.addTo(leafletMap);
        leafletMap.closePopup();
    });

    //Prevent mouse clicking through legend
    var div = L.DomUtil.get('legend');
    if (!L.Browser.touch) {
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
    } else {
        L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
    }
});