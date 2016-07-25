
//initialize leaflet map
var map = new L.Map('map', {center: [37.8, -96.9], zoom: 4})
    .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));

//add svg over leaflet
var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

//load geojson
d3.json("data/districts-geo.json", function(error, collection) {
  if (error) throw error;

  //convert geojson to svg
  var transform = d3.geo.transform({point: projectPoint}),
    path = d3.geo.path().projection(transform);

  //create path elements for each feature
  var feature = g.selectAll("path")
    .data(collection.features)
    .enter().append("path");

    console.log(feature)

  //reset svg on map movement
  map.on("viewreset", reset);
  reset();

  //function to reset svg
  function reset(){
	  //compute projected bounding box
	  var bounds = path.bounds(collection),
	    topLeft = bounds[0],
	    bottomRight = bounds[1];

	    console.log(bounds)

	  //set the dimensions of the svg
	  svg .attr("width", bottomRight[0] - topLeft[0])
	      .attr("height", bottomRight[1] - topLeft[1])
	      .style("left", topLeft[0] + "px")
	      .style("top", topLeft[1] + "px");
	  g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

	  //initialize path data by setting d attribute
  	  feature.attr("d", path);
  }

  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

});

