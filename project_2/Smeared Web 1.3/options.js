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
		document.getElementById('cache_sw').className = "cache_sw";

		document.getElementById('view_sw').className = "options_active_sw";
		document.getElementById('info_sw').className = "options_sw";
	});
};

function infoCache() {
	chrome.storage.local.get(['Testing'], function(result) {
		document.getElementById('cache_sw').innerHTML = 
		"<p>There are <strong>" + result.Testing.length + "</strong> cached webpages.</p><br><button id='reset_sw' class='sub_options_sw'>Clear Cache</button>";
		document.getElementById('cache_sw').className = "info_sw";
		document.getElementById('reset_sw').addEventListener('click',removeCache);

		document.getElementById('view_sw').className = "options_sw";
		document.getElementById('info_sw').className = "options_active_sw";
	});
};

///////////////////////////////////////////////////////////////
//////////////////////// OPTIONS //////////////////////////////

function loadedDOM() {
	 
};

document.addEventListener('DOMContentLoaded', loadedDOM);
document.getElementById('view_sw').addEventListener('click',viewCache);
document.getElementById('info_sw').addEventListener('click',infoCache);