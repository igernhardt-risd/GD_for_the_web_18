function removeCache() {
	chrome.storage.local.set({"Testing": []}, function() {
	});
	location.reload();
};

function viewCache() {
	chrome.storage.local.get(['Testing'], function(result) {
		document.getElementById('cache_sw').innerHTML = result.Testing.toString();
		console.log(result.Testing.toString());
	});
};

function loadedDOM() {
	
};

document.addEventListener('DOMContentLoaded', loadedDOM);
document.getElementById('reset_sw').addEventListener('click',removeCache);
document.getElementById('view_sw').addEventListener('click',viewCache);