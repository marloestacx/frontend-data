let data;
let songData = [];
let count = 0;

// set the dimensions and margins of the graph
const margin = {top: 0, bottom: 10, left: 0, right: 0};
const width = 1500 - margin.left - margin.right;
const height = 900 - margin.top - margin.bottom;

// Define the div for the tooltip
var div = d3.select("body").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

// Creates sources <svg> element
const svg = d3.select('#my_dataviz').append('svg')
.attr('width', width+margin.left+margin.right)
.attr('height', height+margin.top+margin.bottom);


//Group used to enforce margin
const g = svg.append('g')
.attr('transform', `translate(${margin.left},${margin.top})`);

//Get 50 populair songs from artist
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

//Get all song data
function getAlbums(data){
	data.forEach( function(result, index, array) {
  
		//Get albums from api with url
		d3.json("https://genius.p.rapidapi.com/" + result.api_path, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "genius.p.rapidapi.com",
				"x-rapidapi-key": "0825494c1bmsh1828917831cd0c7p18e3e7jsn3a9c6a86182c"
			}
		}).then((json) => {
      //Replace zero width space
      title = json.response.song.title.replace(/\u200B/g,'');
      //Add name, artist, album and views in array
      songData.push({
        "name": title,
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
//Add a scale for bubble size
const sqrtScale = d3.scaleSqrt()
.domain(d3.extent(songData, d => d.views))
//Output between 10 and 100
.range([10, 100])

const circle = g.selectAll('circle').data(songData, function(d) { return d.name; });

// Initialize the circle: all located at the center of the svg area
var node = circle.enter()
.append("circle")
    .attr("r", function(d){ return sqrtScale(d.views)})
    //Color circle according to album name
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
    .style("fill-opacity", 0.8)
    .attr("stroke", "#69a2b2")
    .style("stroke-width", 4)

    //Hover show song titel
    .on("mouseover", function(d) {	
      d3.select(this).transition()
        .duration('50')
        .attr('opacity', '.85');
      div.transition()		
          .duration(200)		
          .style("opacity", .9);		
      div.html(d.target.__data__.name)	
          .style("left", (d.pageX) + "px")		
          .style("top", (d.pageY - 28) + "px");	
      })	
      //Change opacity bubble when mouse is on				
    .on("mouseout", function(d) {	
      d3.select(this).transition()
        .duration('50')
        .attr('opacity', '1');
          
        div.transition()		
            .duration(500)		
            .style("opacity", 0);	
  });

circle.update;
//Remove unneeded circles
circle.exit().remove();

// Features of the forces applied to the nodes:
var simulation = d3.forceSimulation()
// Attraction to the center of the svg area
    .force("center", d3.forceCenter().x(width / 2).y(height / 2))
    // Force that avoids circle overlapping
    .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (sqrtScale(d.views)+3) }).iterations(1)) 

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
//Legend
//Albums
svg.append("text").attr("x", 10).attr("y", 40).text("Album").style("font-size", "19px").attr("alignment-baseline","middle")
svg.append("circle").attr("cx",10).attr("cy",70).attr("r", 6).style("fill", "grey")
svg.append("circle").attr("cx",10).attr("cy",100).attr("r", 6).style("fill", "black")
svg.append("circle").attr("cx",10).attr("cy",130).attr("r", 6).style("fill", "green")
svg.append("circle").attr("cx",10).attr("cy",160).attr("r", 6).style("fill", "blue")
svg.append("circle").attr("cx",10).attr("cy",190).attr("r", 6).style("fill", "pink")
svg.append("circle").attr("cx",10).attr("cy",220).attr("r", 6).style("fill", "#FF0000")
svg.append("circle").attr("cx",10).attr("cy",250).attr("r", 6).style("fill", "yellow")
svg.append("circle").attr("cx",10).attr("cy",280).attr("r", 6).style("fill", "white").style("stroke", "black")
svg.append("text").attr("x", 30).attr("y", 70).text("folklore").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 30).attr("y", 100).text("Reputation").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 30).attr("y", 130).text("evermore").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 30).attr("y", 160).text("1989").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 30).attr("y", 190).text("Lover").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 30).attr("y", 220).text("Red").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 30).attr("y", 250).text("Fearless").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 30).attr("y", 280).text("Other").style("font-size", "15px").attr("alignment-baseline","middle")


//Populairity
svg.append("text").attr("x", 10).attr("y", 330).text("Popularity").style("font-size", "19px").attr("alignment-baseline","middle")

// The scale you use for bubble size
var size = d3.scaleSqrt()
  .domain([1, 100])
  .range([1, 100]) 

// Add legend: circles
var valuesToShow = [{name: 'Least popular', number: 10}, {name: 'Average', number: 50},{name: 'Most popular', number: 100}]
var xCircle = 110
var xLabel = 250
var yCircle = 550

svg
  .selectAll("legend")
  .data(valuesToShow)
  .enter()
  .append("circle")
    .attr("cx", xCircle)
    .attr("cy", function(d){ return yCircle - size(d.number) } )
    .attr("r", function(d){ return size(d.number) })
    .style("fill", "none")
    .attr("stroke", "black")

    console.log(songData)

// Add legend: segments
svg
.selectAll("legend")
.data(valuesToShow)
.enter()
.append("line")
  .attr('x1', function(d){ return xCircle + size(d.number) } )
  .attr('x2', xLabel)
  .attr('y1', function(d){ return yCircle - size(d.number) } )
  .attr('y2', function(d){ return yCircle - size(d.number) } )
  .attr('stroke', 'black')
  .style('stroke-dasharray', ('2,2'))

// Add legend: labels
svg
.selectAll("legend")
.data(valuesToShow)
.enter()
.append("text")
  .attr('x', xLabel)
  .attr('y', function(d){ return yCircle - size(d.number)} )
  .text( function(d){ return d.name } )
  .style("font-size", 15)
  .attr('alignment-baseline', 'middle')
}  



//filter
d3.select('#filter').on('change', function() {
  // This will be triggered when the user selects or unselects the checkbox
  const checked = d3.select(this).property('checked');
  if (checked === true) {
    // Checkbox was just checked
    // Keep only data with artist Taylor Swift
    const filtered_data = songData.filter((d) => d.artist === 'Taylor Swift');
    // Update the chart with the filtered data
    circlePack(filtered_data);
  } else {
    // Checkbox was just unchecked
     // Update the chart with all the data we have
    circlePack(songData);
  }
});  

getData();
legend();