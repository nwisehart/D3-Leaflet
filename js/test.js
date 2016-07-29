//init map to specific geo coordinates and zoom level
var mymap = L.map('mapid').setView([47.45, -121.8], 9.4);

//create light background map from mapshaper
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXd3ZWJ0ZWFtIiwiYSI6ImNpcjNyM20zcjAwMTcxN25tOXIycTc1a3MifQ.wCpOJcC1QNSVgkWYhzDHWw', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 15,
}).addTo(mymap);

//add the geojson file
var district_boundary = new L.geoJson();
district_boundary.addTo(mymap);
//district lines
$.ajax({
dataType: "json",
url: "data/demodistrict.geojson",
success: function(data) {
    $(data.features).each(function(key, data) {
        if(data.properties.districtdemo_freeredlunch){
            district_boundary.addData(data);
            district_boundary.setStyle(style);
        }
        //console.log(data)
    });
}
}).error(function() {});

//school sites
var school_sites = new L.geoJson();
//school_sites.addTo(mymap);
$.ajax({
dataType: "json",
url: "data/demoschool.geojson",
success: function(data) {
    $(data.features).each(function(key, data) {
        if(data.geometry.coordinates[0] !== 0) {
            school_sites.addData(data);
        }
        //console.log(data.geometry.coordinates[0])
    });
}
}).error(function() {});

//filter points out by zoom
mymap.on('zoomend', function (e) {
    var currentZoom = mymap.getZoom();
    switch (currentZoom) {
        case 15:
        case 14:
        case 13:
        case 12:
        case 11:
         school_sites.addTo(mymap);
        break;
        default:
         mymap.removeLayer(school_sites);
        break;
    }
});

//color for cloropleth
var getColor = chroma.scale(['#00FF00', '#FFFF00', '#FF0000']).domain([0, 25, 100]); 
function style(feature) {
    console.log(feature);
    return {
        fillColor: getColor(feature.properties.districtdemo_freeredlunch)
    };
}
