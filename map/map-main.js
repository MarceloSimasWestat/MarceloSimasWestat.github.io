$(document).ready(function () {

    var tileIndex;
    var polygonLayer;
    var maxBounds = [[50, -52], [43, -135]]; //US bounds
    var leafletMap = L.map('map', {
        'center': [0, 0],
        'zoom': 10,
        'bounds': maxBounds
    }).fitBounds(maxBounds);

    L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
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
        polygonLayer = L.geoJson(dummy);
        tileIndex = geojsonvt(dummy, tileOptions);
        colorizeFeatures(dummy);
        var tileLayer = L.canvasTiles().params({debug: false, padding: 5}).drawing(drawingOnCanvas);
        tileLayer.addTo(leafletMap);

        leafletMap.on('click', function (e) {
            var x = e.latlng.lng;
            var y = e.latlng.lat;
            var layer = leafletPip.pointInLayer([x,y], polygonLayer, true);
            if(layer.length) {
                $('#district').html("<strong>" + layer[0].feature.properties['Name'] + "</strong></br>" +
                    "<strong>Percent Absent: " + layer[0].feature.properties['Percent Absent'] + "%</strong>");
            }else{
                $('#district').html("");
            }
        });
    }

    /*function getNationalJson(callback) {
        var file = "medium_dummy.json";
        $.ajax({
            dataType: "json",
            url: file,
            success: callback
        });
    }*/

    //getNationalJson(loadNationalData);


    function colorizeFeatures(dummy) {
        for (var i = 0; i < dummy.features.length; i++) {
            dummy.features[i].properties.color = getColor(dummy.features[i].properties["Percent Absent"]);
        }
    }

    //Set color based on absent percentage
    function getColor(d) {
        return d > 95 ? '#800026' :
            d > 90 ? '#BD0026' :
                d > 80 ? '#E31A1C' :
                    d > 60 ? '#FC4E2A' :
                        d > 40 ? '#FD8D3C' :
                            d > 20 ? '#FEB24C' :
                                d > 0 ? '#FED976' :
                                    '#808080';
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
        ctx.strokeStyle = 'grey';

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
            ctx.stroke();
        }
    }
    loadNationalData();

});