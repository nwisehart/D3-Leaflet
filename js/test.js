//init map to specific geo coordinates and zoom level
var mymap = L.map('mapid').setView([47.45, -121.8], 9);

//create light background map from mapshaper
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXd3ZWJ0ZWFtIiwiYSI6ImNpcjNyM20zcjAwMTcxN25tOXIycTc1a3MifQ.wCpOJcC1QNSVgkWYhzDHWw', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 15,
    minZoom: 8,
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
            district_boundary.bindPopup(getDistrictPopup(data));
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

//add legend for cloropleth
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '">' 
            + ((i === 0) ? '<p>0</p>' : '')  
            + ((i === 10) ? '<p class="hundred">100</p>' : '')  + '</i> ';
    }
    div.innerHTML += '<br/>' + 'FREE / REDUCED LUNCH';

    return div;
};

legend.addTo(mymap);

//district pop up box
function getDistrictPopup(data) {
    graphHeight = 100;
    asian = Math.round(parseInt(data.properties.districtdemo_PercentAsian) + parseInt(data.properties.districtdemo_PercentAsianPacificIslander));
    hispanic = Math.round(data.properties.districtdemo_PercentHispanic);
    white = Math.round(data.properties.districtdemo_PercentWhite);
    african = Math.round(data.properties.districtdemo_PercentBlack);
    return "<div class='popupbox'><table>" + 
                "<tr class='district-name row'><td>" + data.properties.NAME + "</td></tr>" +
                "<tr class='lunch data row'><td class='percent'>" + Math.round(data.properties.districtdemo_freeredlunch) + "%" + "</td><td class='label'>% Free / reduced lunch</td></tr>" +
                "<tr class='grad data row'><td class='percent'>" + Math.round(data.properties.districtdemo_GradRate) + "%" + "</td><td class='label'>Graduation rate</td></tr>" +
                "<tr class='esl data row'><td class='percent'>" + Math.round(data.properties.districtdemo_ESL) + "%" + "</td><td class='label'>% ESL</td></tr>" +
                "<tr class='graph row'>" + 
                    "<td class='asian'>" +  
                        "<div class='bar' style='height:" + (asian/100 * graphHeight) + "px;'><p>" + asian + "%</p></div>" +
                        "<p class='tag'>asian</p>" +
                    "</td>" +
                    "<td class='hispanic'>" +  
                        "<div class='bar' style='height:" + (hispanic/100 * graphHeight) + "px;'><p>" + hispanic + "%</p></div>" +
                        "<p class='tag'>hispanic</p>" +
                    "</td>" +
                    "<td class='white'>" +  
                        "<div class='bar' style='height:" + (white/100 * graphHeight) + "px;'><p>" + white + "%</p></div>" +
                        "<p class='tag'>white</p>" +
                    "</td>" +
                    "<td class='african'>" +  
                        "<div class='bar' style='height:" + (african/100 * graphHeight) + "px;'><p>" + african + "%</p></div>" +
                        "<p class='tag'>african</p>" +
                    "</td>" +
                "</tr>" +
                "</table></div>";
}
