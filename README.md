# liri-node-app
LIRI is a command line node app that takes in commands and provides the requested information back to the user.  LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface.  LIRI responds to 4 distinct commands:

* "my-tweets" &ensp; Returns the most recent 20 tweets of the user and logs the response to log.txt.

* "spotify-this-song" &ensp; Returns artist, song name, song preview URL and album name and logs the response to log.txt.  If no song name is included in the node arguments the song defaults to "The Sign" by "The Ace of Base".

* "movie-this" &ensp; Returns movie title, year released, IMDB and Rotten Tomatoes ratings, country where the movie was produced, language of the movie, plot, and actors and logs the response to log.txt.

* "do-what-it-says" &ensp; Reads one of the above 3 commands written in random.txt file and responds accordingly as per the above. 

## About
liri-node-app is programmed in javascript and makes use of the following npm packages

* dotenv &ensp; Used to to store twitter and spotify access keys in a .env file.

* twitter &ensp; Used to simplify the query requests to the twitter API.

* node-spotify-api  &ensp; Used to simplify the query requests to the spotify API

* request &ensp; Used to make requests to the OMDB API

* moment &ensp; Used to convert the data format for tweet and movie release date responses

