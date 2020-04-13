let apiKey = "976244ff-925d-4f0b-9392-8c3ddf3dec05";
let wikiQuery = "https://en.wikipedia.org/w/api.php";

let destination_card = $(".destination-card");


function searchWiki(searchTerm) {
    $.ajax({
        url: wikiQuery,
        method: "GET",
        dataType: "jsonp",
        data: {
            action: "query",
            format: "json",

            generator: 'search',
            gsrsearch: searchTerm,
            gsrlimit: 1,

            prop: "extracts|pageimages|images",
            exchars: "300",
            exlimit: "max",
            explaintext: true,
            exintro: true,

            piprop: 'thumbnail',
            pilimit: 'max',
            pithumbsize: 200,
            //probably only want to save this information for later searching
            imlimit: "10"
        },
        success: function(json) {
            console.log(json)
        },
    })
}

function displayLocations(locations) {
    //each location call wiki for wiki page
    let length = locations.length < 10 ? locations.length : 10;
    
    for(let i = 0; i < length; i++) {
        searchWiki(locations[i].location);
    }

}

function createActors(actors) {

    //Setting max actor to be display     
    let maxActorDisplay = 5;
    let length = actors.length > maxActorDisplay ? maxActorDisplay : actors.length;
    let div = $("<div class='actors card-content'>")
    for(let i = 0; i < length; i++) {
        let actor = $("<div class='actor'>");
        actor.html(`<img src="${actors[i].urlPhoto}">
                    <p> 
                        <a target="_blank" href="${actors[i].urlProfile}">
                                ${actors[i].actorName}</a>
                    </p>
        `)
        div.append(actor);
    }
    return div;
}

//Displaying information for movie-summary-card
function addMovieInfo(movie) {
    let movieInfo = $(".movie-summary-card");

    let trailer = movie.trailer.qualities[2].videoURL;
    //Use simple plot if plot is above 500 characters long / too long
    let plot = movie.plot.length > 500 ? movie.simplePlot : movie.plot; 

    // <img src=${movie.urlPoster} width="100%">
    let card_div = $("<div class='card-image'>")
    card_div.append(`<div class="card-image">
                        <video src="${trailer}" poster="${movie.urlPoster}" 
                        width="100%" controls>
                    </div>
                    <div class="card-content ">
                        <h5 class="movie-title">${movie.title} </h5>
                        <p> ${plot} </p>
                    </div> `)

    card_div.append(createActors(movie.actors));

    movieInfo.html("<div class='card'></div>").append(card_div);

}
$(".searchBtn").on("click", function() {
    event.preventDefault();
    let movieName = $(".search").val();
    let queryString = `https://www.myapifilms.com/imdb/idIMDB?title=${movieName}&token=${apiKey}&\
format=json&language=en-us&aka=0&filter=2&exactFilter=0&limit=1&trailers=1&actors=1&fullSize=1&filmingLocations=2`
        
    $.ajax({
        url: queryString,
        method: "GET",
    }).then(function(response){

        //Check if response is good
        console.log(response);
        let movieData = response.data.movies[0];
        
        //Display movie-information
        addMovieInfo(movieData);



        /*
            data.filmingLocations: Array 
            data.filmingLocations.location 
            data.filmingLocations.remarks  have some extra information but some are less than useful
        */
        if(movieData.filmingLocations.length) {
            displayLocations(movieData.filmingLocations);
        } else {
            console.log("movie does not have filing location/ Narnia?")
        }
    });
})


// let imagesSearch = function(pageID) {
//     console.log({pageID})
//     $.ajax({
//         url: query,
//         method: "GET",
//         data: {
//             "action": "query",
//             "format": "json",
//             "prop": "imageinfo",
//             "iiprop": "url",
//             "titles": pageID
//         },
//         success: function(json) {
//             console.log(json);
//             // query.pages["-1"].imageinfo[0].url
//             //json.query.pages[key].imageInfo[url] . 
//         }
//     },)

// }

// wikiApi();