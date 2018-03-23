//loads environment variables from .env file
//.env holds access keys for twitter and spotify APIs
require("dotenv").config();

//provides access to twitter and spotify API key objects
var keys = require("./keys.js");

//node package for queries to twitter API
var Twitter = require('twitter');

//node package for queries to spotify API
var Spotify = require('node-spotify-api');

//used to format date information
var moment = require('moment');

//used to query the OMDB API
var request = require("request");

//used for reading query requests from random.txt
//and appending command and query response data to log.txt
var fs = require("fs");

//create objects holding spotify and twitter API access keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//variable to capture node CLI command
var command = process.argv[2];

//append command to log.txt
fs.appendFile("log.txt", "\r\n" + "Command: " + command + "\r\n", function(error) {
    if (error) {
      return console.log(err);
    }
  });

// Store all of the arguments in an array
var nodeArgs = process.argv;

// Create an empty variable for holding the song name
var songName = "";

// Create an empty variable for holding the movie name
var movieName = "";

//conditional statements based on node CLI command
if(command === "my-tweets") {

    //call twitter function
    twitter();

} else if (command === "spotify-this-song") {

    //determine whether song name was included with command
    if(process.argv[3]===undefined) {

        //song name if no song was included with command
        songName = "The Sign"
    
    } else {
    
        //loop through node CLI arguments to convert song name to string
        for (var i = 3; i < nodeArgs.length; i++) {
    
            //check if argument is first word in song name
            if (i > 3 && i < nodeArgs.length) {
        
            //concatenate argument to song name with + sign in between arguments.
            songName = songName + "+" + nodeArgs[i];
            } else {
        
            //ensures that there is no + sign in front of first word in song name
            songName += nodeArgs[i];
            }
        }
    }

    //call spotify function
    spotifySearch();

} else if (command === "movie-this") {

    if(process.argv[3]===undefined) {

        //move name if no movie was included with command
        movieName = "Fantastic+Beasts+and+Where+to+Find+Them"
    
    } else {
    
        //movie name if no movie was included with command
        for (var i = 3; i < nodeArgs.length; i++) {
    
            //check if argument is first word in movie name
            if (i > 3 && i < nodeArgs.length) {
        
            //concatenate argument to movie name with + sign in between arguments.
            movieName = movieName + "+" + nodeArgs[i];
        
            } else {
        
            //ensures that there is no + sign in front of first word in movie name
            movieName += nodeArgs[i];
            }
        }
    }

    //call omdb function
    omdb();

} else if (command === "do-what-it-says") {

    //read the command from the random.txt file
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
    
        // Convert random.txt command string to arguments in array
        data = data.split(",");

        //assign first item in data array as value of command variable
        command = data[0];

        //append command to log.txt
        fs.appendFile("log.txt", "It Says: " + command + "\r\n", function(error) {
            if (error) {
              return console.log(error);
            }
        });

        //determine which function to execute
        if(command === "spotify-this-song") {
            
            //assign second item in data array as value of songName variable
            songName = data[1];

            //call spotify function
            spotifySearch();

        } else if (command === "movie-this") {

            //assign second item in data array as value of movieName variable
            movieName = data[1];

            //call omdb function
            omdb();
        } else if (command === "my-tweets") {

            //call twitter function
            twitter();
        
        } else {

            //message if command in random.txt file is not one of the above
            console.log("Unknown Command");
        }

    });

} else {

    //message if node CLI command is not one of the above
    console.log("Unknown Command");
}

//twitter function
function twitter() {

    //npm "twitter" package
    //twitter API query for last 20 tweets of user whose credentials are being passed in "client"
    client.get('statuses/user_timeline', {tweet_mode: 'extended'}, function(error, tweets, response) {

        //return error to CLI if twitter API query was not successful
        if(error) {
            console.log(error);
        }

        //loop through each of the tweets in the response
        for (i=0; i< tweets.length; i++) {

            //assign tweet text to variable
            var myTweet = tweets[i].full_text;

            //assign date of tweet to variable
            var date = tweets[i].created_at;

            //convert tweet date format using npm package "moment"
            var tweetDate = moment(date, "ddd MMM DD HH:mm:ss ZZ YYYY").format("ddd, MMM Do YYYY, h:mm:ss a");
            
            //return tweet date and text to command line
            console.log(tweetDate + "  " + myTweet + "\r\n");

            //append tweet date and text to log.txt file
            fs.appendFile("log.txt", "Tweet: " + tweetDate + "  " + myTweet + "\r\n", function(error) {
                
                //return error message to CLI if append was not successful
                if (error) {
                  console.log(error);
                }
            });
        }
    });
}

//spotify function
function spotifySearch() {

    //npm spotify package
    //spotify API query for track with specific song name
    spotify.search({ type: 'track', query: songName }, function(error, data) {

        //return error to CLI if spotify API query was not successful
        if (error) {
          return console.log('Error occurred: ' + error);
        }

        //check if song name was the default "The Sign"
        if(songName === "The Sign") {

            //loop through all of the response tracks with song name "The Sign"
            for(i=0; i<data.tracks.items.length; i++) {

                //assign songInfo, artist, and name to variables
                var songInfo = data.tracks.items[i];
                var artist = songInfo.artists[0].name;
                var song = songInfo.name;

                //check if the artist is "Ace of Base"
                if (artist === "Ace of Base" && song === "The Sign") {

                    //return artist, song name, song preview URL and album name to CLI
                    console.log("Artist: " + artist);
                    console.log("Song Name: " + song);
                    console.log("Song Preview URL: " + songInfo.preview_url);
                    console.log("Album Name: " + songInfo.album.name);

                    //append artist, song name, song preview URL and album name to log.txt 
                    fs.appendFile("log.txt", "Artist: " + artist + "\r\n" + "Song Name: " + song + "\r\n" + 
                    "Song Preview URL: " + songInfo.preview_url + "\r\n" + "Album Name: " + songInfo.album.name + "\r\n", function(error) {
                        
                        //return error to CLI if append was not successful
                        if (error) {
                          return console.log(error);
                        }
                    });
                }
            }
        } else {

            //return artist, song name, song preview URL and album name to CLI
            var songInfo = data.tracks.items[0];
            console.log("Artist: " + songInfo.artists[0].name);
            console.log("Song Name: " + songInfo.name);
            console.log("Song Preview URL" + songInfo.preview_url);        
            console.log("Album Name: " + songInfo.album.name);

            //append artist, song name, song preview URL and album name to log.txt 
            fs.appendFile("log.txt", "Artist: " + songInfo.artists[0].name + "\r\n" + "Song Name: " + songInfo.name + "\r\n" + 
            "Song Preview URL: " + songInfo.preview_url + "\r\n" + "Album Name: " + songInfo.album.name + "\r\n", function(error) {
                
                //return error to CLI if append was not successful
                if (error) {
                    return console.log(error);
                }
            });

        }
    });
}

//omdb function
function omdb() {

    //define queryUrl based on movie name input by user
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=24e44f";

    //npm request package
    // run a request to the OMDB API with the movie specified
    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            //parse response and assign it to variable
            var movieInfo = JSON.parse(body);

            //capture movie release date
            var date = movieInfo.Released;

            //convert move release date format to year only
            var yearReleased = moment(date, "DD MMM YYYY").format("YYYY");

            //loop through ratings array
            for (i=0; i<movieInfo.Ratings.length; i++) {

                //check if rating source is IMDB or Rotten Tomatoes
                if(movieInfo.Ratings[i].Source === "Internet Movie Database") {

                    //capture IMDB movie rating
                    var movieRatingIMDB = movieInfo.Ratings[i].Value;

                } else if(movieInfo.Ratings[i].Source === "Rotten Tomatoes") {

                    //capture Rotten Tomatoes movie rating
                    var movieRatingRT = movieInfo.Ratings[i].Value;
                }
            }

            //return movie info to CLI
            console.log("Movie Title: " + movieInfo.Title);
            console.log("Year Released:  " + yearReleased);
            console.log("IMDB Rating: " + movieRatingIMDB);
            console.log("Rotten Tomatoes Rating: " + movieRatingRT);
            console.log("Country Where Movie Was Produced: " + movieInfo.Country);
            console.log("Language of Movie: " + movieInfo.Language);
            console.log("Plot: " + movieInfo.Plot);
            console.log("Actors: " + movieInfo.Actors);

            // append movie info to log.txt
            fs.appendFile("log.txt", "Movie Title: " + movieInfo.Title + "\r\n" + "Year Released:  " + yearReleased + "\r\n" + 
            "IMDB Rating: " + movieRatingIMDB + "\r\n" + "Rotten Tomatoes Rating: " + movieRatingRT + "\r\n" + 
            "Country Where Movie Was Produced: " + movieInfo.Country + "\r\n" + 
            "Language of Movie: " + movieInfo.Language + "\r\n" + "Plot: " + movieInfo.Plot + "\r\n" + 
            "Actors: " + movieInfo.Actors + "\r\n", function(error) {
                        
                //return error to CLI if append was not successful
                if (error) {
                    return console.log(err);
                }
            });
        }
    });
}