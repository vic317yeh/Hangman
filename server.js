var express = require('express');
var app = express();
var path = require('path');
var port     = process.env.PORT || 8080;
var logger = require('morgan');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var http = require('http');

// Global
var HANGMAN_URL = 'hangman.coursera.org';
var EMAIL = 'vic.yeh@ucla.edu'

// USE 
// ==========================================
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// SET
// ==========================================
app.set('view engine', 'ejs');
app.set('views', __dirname+ '/views');

// ROUTING
// ==========================================
app.get('/',function(req,res){
	res.render('index');
});

app.get('/newgame',function(req,res){
	var data = '{"email": "' + EMAIL + '"}';
	var name = req.query.name ? req.query.name : 'Guest';

	var options = {
	    host: HANGMAN_URL,
	    path: '/hangman/game',
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/x-www-form-urlencoded',
	        'Content-Length': Buffer.byteLength(data)
	    }
	};

	// http POST request to retrieve data from hangman server
	var httpreq = http.request(options, function(httpres) {
	    httpres.setEncoding('utf8');
	    httpres.on('data', function (chunk) {
	    	chunk = JSON.parse(chunk)
	        var url = '/game/' + chunk.game_key + '?name=' + name;
	        res.redirect(url);
	    });
	});

	httpreq.write(data);
	httpreq.end();
});

app.get('/game/:id',function(req,res){
	var name = req.query.name;
	res.render('game', {
        name : name,
        id: req.params.id
    });
});

app.post('/guess',function(req,res){
	var game_key = req.body.game_key;
	var guess = req.body.guess;
	var data= '{"guess": "' + guess + '"}'

	var options = {
	    host: HANGMAN_URL,
	    path: '/hangman/game/'+game_key,
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/x-www-form-urlencoded',
	        'Content-Length': Buffer.byteLength(data)
	    }
	};

	// http POST request to retrieve data from hangman server
	var httpreq = http.request(options, function(httpres) {
	    httpres.setEncoding('utf8');
	    httpres.on('data', function (chunk) {
	        res.send(chunk);
	    });
	});

	httpreq.write(data);
	httpreq.end();

});

app.use(function(req, res, next) {
    res.status(404).render('404');
});

// START
// ==========================================
app.listen(port);