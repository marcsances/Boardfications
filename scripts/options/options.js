function save_options() {
  var updateDelay = document.getElementById('updateDelay').value;
  var enableNotifications = document.getElementById('enableNotifications').checked;
  console.log(typeof updateDelay);
    if ( typeof updateDelay != "number" ) {
	  	if ( typeof Number(updateDelay) != "number" ) {
	   		updateDelay = 15; document.getElementById('updateDelay').value = 15;
	  	} else {
	  		if ( Number(updateDelay) > 60 ) {
	  			updateDelay = 60; document.getElementById('updateDelay').value = 60;
	  		} else {	
	  			if ( Number(updateDelay) < 10 ) {
	  				updateDelay = 10; document.getElementById('updateDelay').value = 10;
	  			}
	  		}
	  	}
	}
  chrome.storage.sync.set({
    updateDelay: updateDelay,
    enableNotifications: enableNotifications
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      chrome.runtime.reload();
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    updateDelay: 15,
    enableNotifications: true
  }, function(items) {
    document.getElementById('updateDelay').value = items.updateDelay;
    document.getElementById('enableNotifications').checked = items.enableNotifications;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);