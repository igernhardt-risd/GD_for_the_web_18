var markup = document.documentElement.outerHTML;
var newTesting = 1;

// Debug Function
// chrome.storage.local.get(['Testing'], function(result) {
// 	console.log(result.Testing);
// });

chrome.storage.local.get(['Testing'], function(result) {
	if (result.Testing == undefined) {
		chrome.storage.local.set({"Testing": []}, function() {
		});
	} else {
		newTesting = result.Testing;
		newTesting.push(markup);
		console.log(newTesting);
		chrome.storage.local.set({"Testing": newTesting}, function() {
		});
	}
});





