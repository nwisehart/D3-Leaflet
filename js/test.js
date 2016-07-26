//init map to specific geo coordinates and zoom level
var mymap = L.map('mapid').setView([47.45, -121.8], 9.4);

//create light background map from mapshaper
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXd3ZWJ0ZWFtIiwiYSI6ImNpcjNyM20zcjAwMTcxN25tOXIycTc1a3MifQ.wCpOJcC1QNSVgkWYhzDHWw', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
}).addTo(mymap);

//add the geojson file
var district_boundary = new L.geoJson();
district_boundary.addTo(mymap);
//district lines
$.ajax({
dataType: "json",
url: "data/district84.geojson",
success: function(data) {
    $(data.features).each(function(key, data) {
        district_boundary.addData(data);
        console.log(data)
    });
}
}).error(function() {});
//school sites
$.ajax({
dataType: "json",
url: "data/school84.geojson",
success: function(data) {
    $(data.features).each(function(key, data) {
        district_boundary.addData(data);
        console.log(data)
    });
}
}).error(function() {});