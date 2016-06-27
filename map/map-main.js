$(document).ready(function () {
    var elementaryLayer;
    var secondaryLayer;
    var statesBorders;
    var tileIndex;
    var polygonLayer;
    var maxBounds = [[50, -52], [43, -135]]; //US bounds

    var noLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
    });
    var labels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        pane: 'labels',
        zIndex: 650,
        style: {pointerEvents: 'none'}
    });

    var map = L.map('map', {
        center: [0, 0],
        maxZoom: 11,
        layers: [noLabels, labels],
        'bounds': maxBounds
    }).fitBounds(maxBounds);
    var baseMap = {"noLabels": noLabels};
    var labelMap = {"labels": labels};

    var tileOptions = {
        maxZoom: 20,  // max zoom to preserve detail on
        tolerance: 5, // simplification tolerance (higher means simpler)
        extent: 4096, // tile extent (both width and height)
        buffer: 64,   // tile buffer on each side
        debug: 0,      // logging level (0 to disable, 1 or 2)

        indexMaxZoom: 0,        // max zoom in the initial tile index
        indexMaxPoints: 100000 // max number of points per tile in the index
    };
    var tileLayer = L.canvasTiles().params({debug: false, padding: 5}).drawing(drawingOnCanvas);

    var firstKey = Object.keys(elementaryData.objects)[0];
    var data = topojson.feature(elementaryData, elementaryData.objects[firstKey]);

    var secondaryKey = Object.keys(secondary.objects)[0];
    var secondaryData = topojson.feature(secondary, secondary.objects[secondaryKey]);

    function loadJsonData() {
        secondaryLayer = L.geoJson(secondaryData, {
            onEachFeature: function (feature, layer) {
                var popup;
                if (layer.feature.properties['Absent Group'] <= 0) {
                    popup = "<b>" + layer.feature.properties['Name'] +
                        "<hr><b>NO DATA</b>";
                } else {
                    popup = "<b>" + layer.feature.properties['Name'] +
                        "</b><hr><b>Total Absent: " + layer.feature.properties['Total Absent'] + "</b>" +
                        "</b></br><b>Percent Absent: " + layer.feature.properties['Percent Absent'] + "</b>";
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
            },
            zIndex: 10,
            transparent: true
        });

        polygonLayer = L.geoJson(data, {

        });
        tileIndex = geojsonvt(data, tileOptions);
        colorizeFeatures(data);
        tileLayer.addTo(map);

        var highlight;
        map.on('click', function (e) {
            if(highlight){
                map.removeLayer(highlight);
            }
            var layer = leafletPip.pointInLayer([e.latlng.lng, e.latlng.lat], polygonLayer, true);
            var popup;
            if (layer.length) {
                var highlightIndex = layer[0].feature.properties.gid;
                highlight = new L.geoJson(data, {
                    filter: function(feature, layer) {
                        return feature.properties.gid == highlightIndex
                    },
                    style: {color:'deepskyblue'}}).addTo(map);
                if (layer[0].feature.properties['Absent Group'] <= 0) {
                    popup = "<b>" + layer[0].feature.properties['Name'] +
                        "<hr><b>NO DATA</b>";
                    map.openPopup(popup, e.latlng);
                } else
                    popup = "<b>" + layer[0].feature.properties['Name'] +
                        "</b><hr><b>Total Absent: " + layer[0].feature.properties['Total Absent'] + "</b>" +
                        "</b></br><b>Percent Absent: " + layer[0].feature.properties['Percent Absent'] + "</b>";
                map.openPopup(popup, e.latlng);
                map.on('popupclose', function() {
                    map.removeLayer(highlight)
                });
            }
        });
        $('.leaflet-container').css('cursor', 'pointer');


    }
    /*function loadStateBorders(){
        statesBorders = L.geoJson(statesData, {
            style: function (feature) {
                return {
                    color: 'black',
                    weight: 2,
                    opacity: 0,
                    fillOpacity: 0
                }
            }
        }).addTo(map);
        statesBorders.bringToBack();
    }*/

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

    loadJsonData();
    //loadStateBorders();

    $('.elementary').css('background-color', 'yellow').prop("disabled", true);
    $('.elementary').click(function () {
        map.removeLayer(secondaryLayer);
        map.closePopup();
        $(this).css({"background-color": "yellow"}).prop("disabled", true);
        $('.secondary').css({"background-color": "white"}).prop("disabled", false);
    });

    $('.secondary').click(function () {
        secondaryLayer.addTo(map);
        map.closePopup();
        $(this).css({"background-color": "yellow"}).prop("disabled", true);
        $('.elementary').css({"background-color": "white"}).prop("disabled", false);
    });

    //Toggle polygons
    $('.polygonControl').click(function () {
        if (!this.checked) {
            //elementary and unified
            for (var i = 0; i < data.features.length; i++) {
                if (data.features[i].properties["Absent Group"] == $(this).val()) {
                    data.features[i].properties.color = '#e5f5f9';
                }
            }
            map.removeLayer(tileLayer);
            tileLayer = L.canvasTiles().params({debug: false, padding: 5}).drawing(drawingOnCanvas);
            tileLayer.addTo(map);

            secondaryLayer.setStyle({
                fillColor: '#e5f5f9'
            })

        } else {
            for (var j = 0; j < data.features.length; j++) {
                if (data.features[j].properties["Absent Group"] == $(this).val()) {
                    data.features[j].properties.color = getColor(data.features[j].properties["Absent Group"]);
                }
            }
            map.removeLayer(tileLayer);
            tileLayer = L.canvasTiles().params({debug: false, padding: 5}).drawing(drawingOnCanvas);
            tileLayer.addTo(map);
        }
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