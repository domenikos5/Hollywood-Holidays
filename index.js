let apiKey = "976244ff-925d-4f0b-9392-8c3ddf3dec05";
let wikiQuery = "https://en.wikipedia.org/w/api.php";
let modal = $(".modal-self");
let modal_content = $(".content");
let destination_card = $(".destination-card");


function toggleModal() {
    if(modal.css("display") === "none") {
        modal.css("display", "block");
    } else {
        modal.css("display", "none");
    }
}
function moreImagesInModal() {
    toggleModal();
    modal_content.text("");
    let name = $(this).find(".dest-name").text();
    let summary = $(this).find(".dest-summary").text();
    let images = JSON.parse($(this).find(".col").attr("data-images"));
    
    modal_content.append(`<h3> ${name}</h3>
                            <p> ${summary}</p>
                        `)
    
    let image_div = $("<div class='image-div'>");   
    images.forEach( image => {
        imagesSearch(image.title, image_div);
    })
    modal_content.append(image_div);
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
        

                innerDiv.append(`<div class="col s10" data-images='${JSON.stringify(pages[i].images)}'> 
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
    let trailer = movie.trailer.qualities.length !== null ? movie.trailer.qualities[0].videoURL : "";

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


let imagesSearch = function(pageID, image_div) {
    $.ajax({
        url: wikiQuery,
        method: "GET",
        data: {
            "action": "query",
            "format": "json",
            "prop": "imageinfo",
            "iiprop": "url",
            "titles": pageID
        },
        success: function(response) {
            console.log(response);
            let pages = response.query.pages;
            // query.pages["-1"].imageinfo[0].url
            //json.query.pages[key].imageInfo[url] . 
            for(let key in pages) {
                console.log(pages[key]);
                if(pages[key]) {
                    image_div.append(`<img src='${pages[key].imageinfo[0].url}' width="30%">`);
                }
            }
        }
    },)
}

$(".close-bar").on("click", toggleModal);
$(".modal-self").on("click", toggleModal);

// wikiApi();