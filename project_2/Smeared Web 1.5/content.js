var markup = [document.documentElement.outerHTML,window.location.href];
var newTesting = 1;

// Debug Function
// chrome.storage.local.get(['Testing'], function(result) {
// 	console.log(result.Testing);
// });
$(document).ready(function () {
    if(window.location.href.indexOf("google") > -1) {
    } else {
    	chrome.storage.local.get(['Testing'], function(result) {
    		if (result.Testing == undefined) {
    			chrome.storage.local.set({"Testing": []}, function() {
    			});
    		}
			newTesting = result.Testing;
			newTesting.push(markup);
			console.log(newTesting);
			chrome.storage.local.set({"Testing": newTesting}, function() {
			});
    	});
    }
});





