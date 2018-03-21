require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require('twitter');

var Spotify = require('node-spotify-api');

var moment = require('moment');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

if(command === "my-tweets") {
    twitter();
} else if (command === "spotify-this-song") {
    spotify();
} else if (command === "movie-this") {
    omdb();
} else if (command === "do-what-it-says") {
    say_do();
} else {
    console.log("Unknown Command");
}

function twitter() {

    //&tweet_mode=extended

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