let apiKey = "976244ff-925d-4f0b-9392-8c3ddf3dec05";
let wikiQuery = "https://en.wikipedia.org/w/api.php";
let modal = $(".modal-self");
let destination_card = $(".destination-card");


function toggleModal() {
    console.log("here");
    console.log(modal.css("display"))
    if(modal.css("display") === "none") {
        modal.css("display", "block");
    } else {
        modal.css("display", "none");
    }
}
function moreImagesInModal() {
    toggleModal();

}
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
            exchars: "400",
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
            console.log(searchTerm)
            console.log(json)
            let pages = json.query.pages;
            
            for(let i in pages) {
                console.log(pages[i]);
                let imgDiv = $(`<div col s2 dest-image>`);

                let innerDiv = $(`<div class="card-panel grey lighten-5 z-depth-1">`);
                if(pages[i].thumbnail) {
                    imgDiv.append(`<img src="${pages[i].thumbnail.source}" class="square responsive-img">`);
                    innerDiv.append(imgDiv);
                } 
                //might want to add another query call to api to get time
        


                innerDiv.append(`<div class="col s10"> 
                                <h5 class="dest-name"> ${searchTerm} </h5>
                                <span class="dest-summary black-text"> ${pages[i].extract} </span>
                                </div>
                            </div>
                            `)

                innerDiv.on("click", moreImagesInModal);
                
                destination_card.append(innerDiv);
            }
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
    //checking if there is a URL to post
    let trailer = movie.trailer.qualities.length > 0 !== null ? movie.trailer.qualities[0].videoURL : "";
    //Check there is a poster. 
    let poster = movie.urlPoster ? movie.urlPoster : "";

    //Use simple plot if plot is above 500 characters long / too long
    let plot = movie.plot.length > 500 ? movie.simplePlot : movie.plot; 

    let card_div = $("<div class='card-image'>")
    card_div.append(`<div class="card-image">
                        <video src="${trailer}" poster="${poster}" 
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

        destination_card.empty();
        if(movieData.filmingLocations.length) {
            displayLocations(movieData.filmingLocations);
        } else {
            console.log("movie does not have filing location/ Narnia?")
        }
    });
})


let imagesSearch = function(pageID) {
    console.log({pageID})
    $.ajax({
        url: query,
        method: "GET",
        data: {
            "action": "query",
            "format": "json",
            "prop": "imageinfo",
            "iiprop": "url",
            "titles": pageID
        },
        success: function(json) {
            console.log(json);
            // query.pages["-1"].imageinfo[0].url
            //json.query.pages[key].imageInfo[url] . 
        }
    },)

}

$(".close-bar").on("click", toggleModal);
$(".modal-self").on("click", toggleModal);

// wikiApi();