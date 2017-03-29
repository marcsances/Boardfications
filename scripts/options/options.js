
function onDocumentLoad() {
	var linkTag = document.createElement ("link"); linkTag.href = "/stylesheets/options/options.css"; linkTag.rel = "stylesheet";
	document.getElementsByTagName("head")[0].appendChild(linkTag);

	apply_i18n_to_popup();
	
	var bsg=browser.storage.local.get(["updateDelay","enableNotifications","region: "]);
	bsg.then( function(items) {
		document.getElementById('updateDelay').value = items.updateDelay;
		document.getElementById('enableNotifications').checked = items.enableNotifications;
		document.getElementById('region').value = items.region
	},function(){})	
}
document.addEventListener('DOMContentLoaded', onDocumentLoad);

function save_options() {
  var updateDelay = document.getElementById('updateDelay').value;
  var enableNotifications = document.getElementById('enableNotifications').checked;
  var region = document.getElementById("region").value;
  
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
	
	//checkPermissions(region);
	
	var ss=browser.storage.local.set({
		updateDelay: updateDelay,
		enableNotifications: enableNotifications,
		region: region
	});
	ss.then(function(region) {
		var status = document.getElementById('status');
		status.textContent = browser.i18n.getMessage("options_saved");
		setTimeout(function() {
			browser.tabs.getCurrent(function (tab) {browser.tabs.remove(tab.id)});
			browser.extension.getBackgroundPage().reloadExtension();
			status.textContent = '';
		}, 750);
	},function() {});
}

document.getElementById('save').addEventListener('click', save_options);

function checkPermissions(region) {
	/*var bp=browser.permissions.contains({
	  origins: [`https://boards.${region}.leagueoflegends.com/`]
	});
	bp.then(function (permission) {
		if (!permission) {
			askForPermissions(region);
		}
	},function(){});
	not yet implemented in current firefox versions*/
}

function askForPermissions(region) {
	/*var br=browser.permissions.request({
		origins: [`https://boards.${region}.leagueoflegends.com/`]
		});
	br.then(function(granted) {
			if (!granted) {
				var message = browser.i18n.getMessage("options_permissions")
				if (confirm(message)) {
					checkPermissions(region);
				}
			}
		}, function(){});
		
		not yet implemented in current firefox versions*/
}

function apply_i18n_to_popup (){
	var objects = document.getElementsByTagName("*");
	
	for (var i=0, max=objects.length; i < max; i++) {
		var object = objects[i];
		if (object && object.getAttribute("data-i18n") == "true") {
			var message = browser.i18n.getMessage(object.innerHTML.trim()); message = (message == "" && object.innerText || message)
			object.innerText = message;
		}
	}
}

