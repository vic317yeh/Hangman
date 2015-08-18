function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

$(document).ready(function(){


	function judgeOutcome(state) {
		if (state == 'lost') {
			$('#game-modal .modal-title').text("You lost :(");
			$('#game-modal').modal('show');
		} else if (state == 'won') {
			$('#game-modal .modal-title').text("You won!");
			$('#game-modal').modal('show');
		} else if (state == 'error') {
			$('#game-modal .modal-title').text("This game has ended. Start a new game.");
			$('#game-modal').modal('show');
		} else {
			return;
		}
	}

	// append guessed characters into guess list
	function updateGuessedList(phrase) {
	    phrase = phrase.replace(/(.)(?=.*\1)/g, "");
	    phrase = phrase.replace('_','').replace(' ', '');

	    guessedList = phrase.split('');
	}


	/**
	 * Given the number of tries left, update hangman image
	 * @param {Int} tries
	 */
	function updateHangman(tries) {
		var img = '/img/' + String(tries) + '.png';
		$('#hangman-img').attr('src', img);
	}

	/**
	 * Send ajax request to guess the letter
	 * @param {Char} key
	 */
	function guessKey(key) {
		$.ajax({
		  method: "POST",
		  url: "/guess",
		  data: { 
		  	guess: key, 
		  	game_key: $('#game-info').attr('game-key') 
		  }
		})
		  .done(function( msg ) {
		  	// update
		    msg = JSON.parse(msg);
		    if ('error' in msg) {
		    	judgeOutcome('error');
		    	return;
		    }

		    var phrase = msg.phrase;
		    if (first) {
				updateGuessedList(phrase+key);
				first=false;
			}
		    $('#phrase').text(phrase);
		    $('#num-tries').text(msg.num_tries_left);
		    $('#guess-list').text(guessedList.join(', '));
		    updateHangman(msg.num_tries_left);

		    // status
		    var state = msg.state;
		    judgeOutcome(state);
		  });
	}

	var guessedList = [];
	/**
	 * Insert key into the guessed list
	 * @param {Char} key
	 */
	function insertGuessList(key) {
		guessedList.push(key);
		$('#guess-list').text(guessedList.join(', '));
	}

	/**
	 * Check if the key has not yet been guessed
	 * @param {Char} key
	 * @return {Boolean}
	 */	
	function notGuessedYet(key) {
		return guessedList.indexOf(key)==-1;
	}

	var first=true;
	var TRIES = 5;
	$('#num-tries').text(TRIES);

	// user guesses key
	$(document).keypress(function(event){
	    var key = String.fromCharCode(event.which).toLowerCase(); 
	    if (isLetter(key) && notGuessedYet(key)) {
	    	if (first) {
	    		$('.hint').hide();
	    	}

	    	insertGuessList(key);
	    	guessKey(key);
	    	
	    }
	 })

	$('.new-game-btn').click(function(){
		var name = $('#user-name').text();
		window.location.href="/newgame?name="+name;
	});

	// autoguess for the user
	$('.autoguess-btn').click(function(){
		$.get( "/autoguess", {guessedList:guessedList.join('')} , function( data ) {
			var e = jQuery.Event("keypress");
			e.ctrlKey = false;
			e.which = data.charCodeAt(0);
			$(document).trigger(e);
		});
	});

});