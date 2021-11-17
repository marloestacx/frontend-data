let data;
let songData = [];
let count = 0;

// set the dimensions and margins of the graph
const margin = {top: 0, bottom: 10, left: 0, right: 800};
const width = 1600 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// Define the div for the tooltip
var div = d3.select("body").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

// Creates sources <svg> element
const svg = d3.select('#my_dataviz').append('svg')
.attr('width', width+margin.left+margin.right)
.attr('height', height+margin.top+margin.bottom);


// Group used to enforce margin
const g = svg.append('g')
.attr('transform', `translate(${margin.left},${margin.top})`);


//get 50 populair songs from artist
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
      //add name, artist, album and views in array
      songData.push({
        "name": json.response.song.title,
        "artist": json.response.song.artist_names,
        "album": json.response.song.album.name,
        "views": json.response.song.stats.pageviews
      })  

          if(count == array.length - 1){
            circlePack(songData);
          }
          count++
		})
	})  

}

function circlePack(songData)
{

// Add a scale for bubble size
const sqrtScale = d3.scaleSqrt()
.domain(d3.extent(songData, d => d.views))
.range([10, 100])

const circle = g.selectAll('circle').data(songData, function(d) { return d.name; });

// Initialize the circle: all located at the center of the svg area
var node = circle.enter()
.append("circle")
    .attr("r", function(d){ return sqrtScale(d.views)})
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    //color circle according to album name
    .attr("fill", function(songData) {
      if (songData.album == "folklore") {
        return "grey";
      } 
      if (songData.album == "evermore") {
        return "green";
      } 
      else if (songData.album == "reputation") {
        return "black";
      }
      else if (songData.album.includes("1989")) {
        return "blue";
      }
      else if (songData.album.includes("Red")) {
        return "#FF0000";
      }
      else if (songData.album.includes("Lover")) {
        return "pink";
      }
      else if (songData.album.includes("Fearless")) {
        return "yellow";
      }
      return "white";
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

circle.update;
circle.exit().remove();//remove unneeded circles
legend(songData);
console.log(node)
 
// Features of the forces applied to the nodes:
var simulation = d3.forceSimulation()
    .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (sqrtScale(d.views)+3) }).iterations(1)) // Force that avoids circle overlapping
  

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

function legend(){
//legend
svg.append("circle").attr("cx",1000).attr("cy",130).attr("r", 6).style("fill", "grey")
svg.append("circle").attr("cx",1000).attr("cy",160).attr("r", 6).style("fill", "black")
svg.append("circle").attr("cx",1000).attr("cy",190).attr("r", 6).style("fill", "greeen")
svg.append("circle").attr("cx",1000).attr("cy",220).attr("r", 6).style("fill", "blue")
svg.append("circle").attr("cx",1000).attr("cy",250).attr("r", 6).style("fill", "pink")
svg.append("circle").attr("cx",1000).attr("cy",280).attr("r", 6).style("fill", "#FF0000")
svg.append("circle").attr("cx",1000).attr("cy",310).attr("r", 6).style("fill", "yellow")
svg.append("circle").attr("cx",1000).attr("cy",340).attr("r", 6).style("fill", "white").style("stroke", "black")
svg.append("text").attr("x", 1020).attr("y", 130).text("folklore").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 1020).attr("y", 160).text("Reputation").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 1020).attr("y", 190).text("evermore").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 1020).attr("y", 220).text("1989").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 1020).attr("y", 250).text("Lover").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 1020).attr("y", 280).text("Red").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 1020).attr("y", 310).text("Fearless").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 1020).attr("y", 340).text("Other").style("font-size", "15px").attr("alignment-baseline","middle")
}  

//filter
d3.select('#filter-us-only').on('change', function() {
  // This will be triggered when the user selects or unselects the checkbox
  const checked = d3.select(this).property('checked');
  if (checked === true) {
    // Checkbox was just checked
    // Keep only data element whose country is US
    const filtered_data = songData.filter((d) => d.artist === 'Taylor Swift');
    circlePack(filtered_data);  // Update the chart with the filtered data
  } else {
    // Checkbox was just unchecked
    circlePack(songData);  // Update the chart with all the data we have
  }
});  

getData();
