require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require('twitter');

var Spotify = require('node-spotify-api');

var moment = require('moment');

var request = require("request");

var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

// Store all of the arguments in an array
var nodeArgs = process.argv;

// Create an empty variable for holding the song name
var songName = "";

// Create an empty variable for holding the song name
var movieName = "";

function nodeCommands() {}

if(command === "my-tweets") {

    twitter();

} else if (command === "spotify-this-song") {

    if(process.argv[3]===undefined) {

        songName = "The Sign"
    
    } else {
    
        for (var i = 3; i < nodeArgs.length; i++) {
    
            if (i > 3 && i < nodeArgs.length) {
        
            songName = songName + "+" + nodeArgs[i];
        
            }
        
            else {
        
            songName += nodeArgs[i];
        
            }
        }
    }

    spotifySearch();

} else if (command === "movie-this") {

    if(process.argv[3]===undefined) {

        movieName = "Fantastic+Beasts+and+Where+to+Find+Them"
    
    } else {
    
        for (var i = 3; i < nodeArgs.length; i++) {
    
            if (i > 3 && i < nodeArgs.length) {
        
            movieName = movieName + "+" + nodeArgs[i];
        
            }
        
            else {
        
            movieName += nodeArgs[i];
        
            }
        }
    }

    omdb();

} else if (command === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
    
        // Break down all the numbers inside
        data = data.split(",");
        command = data[0];

        if(command === "spotify-this-song") {

            songName = data[1];
            spotifySearch();

        } else if (command === "movie-this") {
            movieName = data[1];
            omdb();
        } else if (command === "my-tweets") {

            twitter();
        
        } else {
            console.log("Unknown Command");
        }

    });

} else {
    console.log("Unknown Command");
}

function twitter() {

    client.get('statuses/user_timeline', {tweet_mode: 'extended'}, function(error, tweets, response) {
        if(error) throw error;

        for (i=0; i< tweets.length; i++) {;
            var myTweet = tweets[i].full_text;
            var date = tweets[i].created_at;
            var tweetDate = moment(date, "ddd MMM DD HH:mm:ss ZZ YYYY").format("ddd, MMM Do YYYY, h:mm:ss a");
            console.log(tweetDate + "  " + myTweet + "\r\n");
        }
    });
}

function spotifySearch() {

    spotify.search({ type: 'track', query: songName }, function(error, data) {

        if (error) {
          return console.log('Error occurred: ' + error);
        }

        if(songName === "The Sign") {
            for(i=0; i<data.tracks.items.length; i++) {
                var songInfo = data.tracks.items[i];
                var artist = songInfo.artists[0].name;
                var song = songInfo.name;

                if (artist === "Ace of Base" && song === "The Sign") {
                    console.log("Artist: " + artist);
                    console.log("Song Name: " + song);
                    console.log("Song Preview URL: " + songInfo.preview_url);
                    console.log("Album Name: " + songInfo.album.name);
                }
            }
        } else {

            var songInfo = data.tracks.items[0];
            console.log("Artist: " + songInfo.artists[0].name);
            console.log("Song Name: " + songInfo.name);
            console.log("Song Preview URL" + songInfo.preview_url);        
            console.log("Album Name: " + songInfo.album.name);
        }
    });
}

function omdb() {

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=24e44f";

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            var movieInfo = JSON.parse(body);
            var date = movieInfo.Released;
            var yearReleased = moment(date, "DD MMM YYYY").format("YYYY");

            for (i=0; i<movieInfo.Ratings.length; i++) {

                if(movieInfo.Ratings[i].Source === "Internet Movie Database") {
                    var movieRatingIMDB = movieInfo.Ratings[i].Value;
                } else if(movieInfo.Ratings[i].Source === "Rotten Tomatoes") {
                    var movieRatingRT = movieInfo.Ratings[i].Value;
                }
            }

            console.log("Movie Title: " + movieInfo.Title);
            console.log("Year Released:  " + yearReleased);
            console.log("IMDB Rating: " + movieRatingIMDB);
            console.log("Rotten Tomatoes Rating: " + movieRatingRT);
            console.log("Country Where Movie Was Produced: " + movieInfo.Country);
            console.log("Language of Movie: " + movieInfo.Language);
            console.log("Plot: " + movieInfo.Plot);
            console.log("Actors: " + movieInfo.Actors);
        }
    });
}