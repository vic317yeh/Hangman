var frequencyList = ['E','T','A','O','I','N','S','R','H','L','D','C','U','M','F','P','G','W','Y','B','V','K','X','J','Q','Z'];
var api = {
	
	// simple method to guess for the user
	autoguess: function(keyList) {
		var guess='';
		for (var i=frequencyList.length-1; i>=0; i--) {
			if (keyList.indexOf(frequencyList[i].toLowerCase()) == -1) {
				guess = frequencyList[i].toLowerCase();
			}	
		}
		return guess;
	}

};

module.exports = api;