let data;
let songData;

function getData(){
d3.json("https://genius.p.rapidapi.com/artists/1177/songs?sort=popularity&per_page=50", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "genius.p.rapidapi.com",
		"x-rapidapi-key": "0825494c1bmsh1828917831cd0c7p18e3e7jsn3a9c6a86182c"
	}
}).then((json) => {

  data = json.response.songs;
//   update(data);
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
		
		  songData = json.response;
		  console.log(songData.song.title +" " + songData.song.album.name)
			
		});
	})


}

getData();

