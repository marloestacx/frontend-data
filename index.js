let data;
let songData = [];
// let newData = [];
let count = 0;

//&per_page=50
//get 20 populair songs from artist
function getData(){
d3.json("https://genius.p.rapidapi.com/artists/1177/songs?sort=popularity&per_page=50", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "genius.p.rapidapi.com",
		"x-rapidapi-key": "0825494c1bmsh1828917831cd0c7p18e3e7jsn3a9c6a86182c"
	}
}).then((json) => {

  data = json.response.songs;
	getAlbums(data);
})};

//get all song data
function getAlbums(data){
	data.forEach( function(result, index, array) {
  
		//get albums from api with url
		d3.json("https://genius.p.rapidapi.com/" + result.api_path, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "genius.p.rapidapi.com",
				"x-rapidapi-key": "0825494c1bmsh1828917831cd0c7p18e3e7jsn3a9c6a86182c"
			}
		}).then((json) => {
      //add name, album and views in array
      // console.log(json.response.song.stats.pageviews)
      songData.push({
        "name": json.response.song.title,
        "artist": json.response.song.artist_names,
        "album": json.response.song.album.name,
        "views": json.response.song.stats.pageviews
      })  

          if(count == array.length - 1){
            update(songData);
          }
          count++
		})
	})  

}

function update(songData)
{
// set the dimensions and margins of the graph
var width = 800
var height = 800

// Define the div for the tooltip
var div = d3.select("body").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", 800)
    .attr("height", 800)

    console.log(songData);

    // UPDATE
    // update existing elements
    (update) => update,
    // EXIT
    // elements that aren't associated with data
    (exit) => exit.remove();
// Initialize the circle: all located at the center of the svg area
var node = svg.append("g")
  .selectAll("circle")
  .data(songData)
  .enter()
  .append("circle")
    .attr("r", 25)
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    //color circle according to album name
    .attr("fill", function(songData) {
      if (songData.album == "folklore") {
        return "grey";
      } 
      if (songData.album == "evermore") {
        return "brown";
      } 
      else if (songData.album == "reputation") {
        return "black";
      }
      else if (songData.album == "1989 (Deluxe)") {
        return "blue";
      }
      else if (songData.album.includes("Red")) {
        return "#FF0000";
      }
      else if (songData.album == "Lover (Target Exclusive)") {
        return "pink";
      }
      return "yellow";
    })
    // .style("fill", "#69b3a2")
    .style("fill-opacity", 0.8)
    .attr("stroke", "#69a2b2")
    .style("stroke-width", 4)

    //hover show song titel
    .on("mouseover", function(d) {	
      d3.select(this).transition()
        .duration('50')
        .attr('opacity', '.85');
      div.transition()		
          .duration(200)		
          .style("opacity", .9);		
      div	.html(d.target.__data__.name)	
          .style("left", (d.pageX) + "px")		
          .style("top", (d.pageY - 28) + "px");	
      })					
    .on("mouseout", function(d) {	
      d3.select(this).transition()
        .duration('50')
        .attr('opacity', '1');
          
        div.transition()		
            .duration(500)		
            .style("opacity", 0);	
  });
 
 
// Features of the forces applied to the nodes:
var simulation = d3.forceSimulation()
    .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(.01).radius(30).iterations(3)) // Force that avoids circle overlapping

// Apply these forces to the nodes and update their positions.
// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
simulation
    .nodes(songData)
    .on("tick", function(d){
      node
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; })
    });
}

//filter
d3.select('#filter-us-only').on('change', function() {
  // This will be triggered when the user selects or unselects the checkbox
  const checked = d3.select(this).property('checked');
  if (checked === true) {
    // Checkbox was just checked
    // Keep only data element whose country is US
    // console.log(songData)
    const filtered_data = songData.filter((d) => d.artist === 'Taylor Swift');
    update(filtered_data);  // Update the chart with the filtered data
  } else {
    // Checkbox was just unchecked
    update(songData);  // Update the chart with all the data we have
  }
});  

getData();
