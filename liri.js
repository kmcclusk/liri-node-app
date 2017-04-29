var dataKeys = require("./keys.js");
var fs = require("fs");
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');


var liriCommands = function(caseData, functionData) {
  switch (caseData) {
    case 'my-tweets':
      myTweets();
      break;
    case 'spotify-this-song':
      searchSpotify(functionData);
      break;
    case 'movie-this':
      movieInput(functionData);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log('Yikes. I don\'t know that');
  }
}

var myTweets = function() {

  var client = new twitter(dataKeys.twitterKeys);

  var params = { screen_name: 'kateb4kearney', count: 2 };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {
      var data = [];

      for (var i = 0; i < tweets.length; i++) {
        data.push({

            'created at: ' : tweets[i].created_at,
            'Tweets: ' : tweets[i].text,
        });
      }
      console.log(data);
      writeToLog(data);
    }
  });
};

var getArtistNames = function(artist) {
  return artist.name;
};

var searchSpotify = function(songName) {

  
  if (songName === undefined) {

    songName = 'The Real Slim Shady';
  };

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

    var songs = data.tracks.items;
    var data = []; 

    for (var i = 0; i < songs.length; i++) {
      data.push({
        'artist(s)': songs[i].artists.map(getArtistNames),
        'song name: ': songs[i].name,
        'preview song: ': songs[i].preview_url,
        'album: ': songs[i].album.name,
      });
    }
    console.log(data);
    writeToLog(data);
  });
};

var movieInput = function(movieName) {

  if (movieName === undefined) {
    movieName = "Attack of the Killer Tomatoes";
  }

  var movieURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

  request(movieURL, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = [];
      var jsonData = JSON.parse(body);

      data.push({
      'Title: ' : jsonData.Title,
      'Year: ' : jsonData.Year,
      'Rated: ' : jsonData.Rated,
      'IMDB Rating: ' : jsonData.imdbRating,
      'Country: ' : jsonData.Country,
      'Language: ' : jsonData.Language,
      'Plot: ' : jsonData.Plot,
      'Actors: ' : jsonData.Actors,
      'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
      'Rotton Tomatoes URL: ' : jsonData.tomatoURL,
  });
      console.log(data);
      writeToLog(data);
}
  });

}

var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    writeToLog(data);
    var dataArr = data.split(",")

    if (dataArr.length == 2) {
      liriCommands(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      liriCommands(dataArr[0]);
    }

  });
}

var writeToLog = function(data) {
  fs.appendFile("log.txt", '\r\n\r\n');

  fs.appendFile("log.txt", JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("log.txt was updated!");
  });
}

var load = function(argOne, argTwo) {
  liriCommands(argOne, argTwo);
};

load(process.argv[2], process.argv[3]);