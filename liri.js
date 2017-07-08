var request = require("request");
var Twitter = require("twitter");
var Omdb = require("omdb");
var Spotify = require("node-spotify-api");

var fs = require("fs");
var key = require("./keys.js");

var client = new Twitter({
    consumer_key: '2UGQeM1sbwxQwcjQn5MokioZA',
    consumer_secret: 'IdL5JMuMSdq5isbIq2DVeqlwjL8Qw3c7q36zpvFUP86NheiID9',
    access_token_key: '37140347-s6rRuaM8uNPdqgIL1uvZvrOSnsS42D1BPRF1W8ZqP',
    access_token_secret: 'jj1jVJzHWJYkwZ3CQJOjiu6AJqapVfkV5Lumt28Hdkz7G'
});
var params = { screen_name: "Davin_Patel" };

var spotify = new Spotify({
    id: "fb30d6c864df4881adba52eec261fa46",
    secret: "60ee5d4689c44f07805467097fe87a4c"
});

var operator = process.argv[2];
var input = process.argv[3];
var tweets;

if (operator == "my-tweets") {
    displayTweets();
} else if (operator == "spotify-this-song") {
    displaySpotify(input);
} else if (operator == "movie-this") {
    displayMovie();
} else if (operator == "do-what-it-says") {
    doWhatItSays();
}

function displayTweets() {
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            var totalTweets = 20;

            for (i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
                if (i > totalTweets) {
                    break;
                }
            }
        } else if (error) {
            console.log(error);
        }
    });
}

function displaySpotify(input) {
    if (input == null) {
        input = "goosebumps";
    }

    spotify.search({ type: 'track', query: input }, function(err, data) {
        if (err) {
            console.log(err);
            return;

        } else if (!err) {        
            console.log("Song: " + input);
            console.log("Artist: " + JSON.stringify(data.tracks.items[0].album.artists[0].name));
            console.log("Preview Link: " + JSON.stringify(data.tracks.items[0].album.artists[0].external_urls.spotify));
            console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name));
        }
    });
}


function displayMovie() {
    if (input == null) {
        input = "Crash";
    }
    var queryURL = "http://www.omdbapi.com/?apikey=40e9cece&t=" + input + "&y=&plot=short&r=json"
    request(queryURL, function(error, response, body) {
        if (!error) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country of Production: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        } else if (error) {
            console.log(error);
            return;
        }
    });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (!error) {
            var dataArray = data.split(",");
            displaySpotify(dataArray[1]);
        } else if (error) {
            console.log(error);
        }
    });
}
