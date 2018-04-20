////////////////////// MATH FUNCTIONS /////////////////////////
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
function splice(string, string2) {
	var split = Math.floor(Math.random() * (string.length + 1));
	var result = (string.substr(0,split)) + string2 + (string.substr(split, string.length - split));
	return result;
}
///////////////////////////////////////////////////////////////
//////////////////////// CACHE RELATED ////////////////////////

function removeCache() {
	chrome.storage.local.set({"Testing": []}, function() {
	});
	location.reload();
};

function viewCache() {
	chrome.storage.local.get(['Testing'], function(result) {
		var shuffled = shuffle(result.Testing);
		var initial = shuffled[0];
		for (var i = 0; i < shuffled.length - 1; i++) {
			initial = splice(initial, shuffled[i + 1]);
		}
		document.getElementById('cache_sw').innerHTML = initial.toString();
		document.getElementById('cache_sw').style.width = "1200px"
		document.getElementById('cache_sw').style.height = "800px"
	});
};

///////////////////////////////////////////////////////////////
//////////////////////// OPTIONS //////////////////////////////

function loadedDOM() {
	 
};

document.addEventListener('DOMContentLoaded', loadedDOM);
document.getElementById('reset_sw').addEventListener('click',removeCache);
document.getElementById('view_sw').addEventListener('click',viewCache);