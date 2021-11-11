let data;
let songData = [];
let newData = [];

function getData(){
d3.json("https://genius.p.rapidapi.com/artists/1177/songs?sort=popularity", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "genius.p.rapidapi.com",
		"x-rapidapi-key": "0825494c1bmsh1828917831cd0c7p18e3e7jsn3a9c6a86182c"
	}
}).then((json) => {

  data = json.response.songs;
	getAlbums(data);
})};


function getAlbums(data){

	data.forEach(result => {
		//get albums from api with url
		d3.json("https://genius.p.rapidapi.com/" + result.api_path, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "genius.p.rapidapi.com",
				"x-rapidapi-key": "0825494c1bmsh1828917831cd0c7p18e3e7jsn3a9c6a86182c"
			}
		}).then((json) => {
		

		//   songData = json.response;
        // console.log(json.response.song.values

          songData.push(json.response.song.title);
        //   const obj = Object.fromEntries("name" + songData);
        // const obj = Object.fromEntries(songData);


        const obj = Object.fromEntries(
            Object.entries(songData)
            .map(([ key, val ]) => [ "Name", val])
          );
          newData.push(obj);
		});
	})
    // console.log(songData);
    circlePack(newData);
    console.log(newData)
}

getData();


function circlePack(newData)
{
// set the dimensions and margins of the graph
var width = 450
var height = 450

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", 450)
    .attr("height", 450)

// create dummy data -> just one element per circle
let newdata = [{ "name": "A" }, { "name": "B" }, { "name": "C" }]
console.log(newData)
// console.log(songData)

// Initialize the circle: all located at the center of the svg area
var node = svg.append("g")
  .selectAll("circle")
  .data(newData)
  .enter()
  .append("circle")
    .attr("r", 25)
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", "#69b3a2")
    .style("fill-opacity", 0.3)
    .attr("stroke", "#69a2b2")
    .style("stroke-width", 4)

// Features of the forces applied to the nodes:
var simulation = d3.forceSimulation()
    .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(.01).radius(30).iterations(1)) // Force that avoids circle overlapping

// Apply these forces to the nodes and update their positions.
// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
simulation
    .nodes(newData)
    .on("tick", function(d){
      node
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; })
    });
}