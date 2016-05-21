notifications = "blank";
notifications_cache = "blank";
options = [];

  document.addEventListener("DOMContentLoaded", function() {

	var updateNotifications = function () {
		var xhr = new XMLHttpRequest();
		var resp = undefined;

		xhr.open("GET", "http://boards.las.leagueoflegends.com/es/myupdates.json?show=unread", true);
		xhr.timeout = 5000;
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		  	if (xhr.status === 200) {
			    try {
			    	resp = JSON.parse(xhr.responseText);
			    } catch(e) {
			    	updateBadge("E530", true);
			    };

			    if (resp != undefined) {
			    	notifications = resp;
			    	var unread_notif = String(resp.searchResultsCount) || String(resp.resultsCount);
			    	updateBadge(unread_notif);
			    } else {
			    	return 0;
			    }
			    if ( options['enableNotifications'] ) {
				    if ( isArray(notifications_cache) && isArray(notifications) && unread_notif != "0") {
				    	if ( notifications_cache.updates != notifications.updates && notifications.updates.length > 0 ) {
				    		submitNotification();
				    	}
				    }
				    notifications_cache = notifications;
			    }
		  	}
		  }
		}
		xhr.ontimeout = function () { 
			updateBadge("ERR", true)
		}
		if (!navigator.onLine) { xhr.ontimeout(); } else { xhr.send(); }
		updateTimer();
	}

	var updateTimer = function () {
		setTimeout(updateNotifications, options['updateDelay']*1000);
	}

	var updateBadge = function (text, error) {
		if ( error ) {
			chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
		} else {
			if ( text == "0" ) {
				chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 255, 255] });
			} else {
				chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 0, 255] });
			}
		}
		chrome.browserAction.setBadgeText({text: text});
	}

	var isArray = function (object) {
		return typeof object === "object";
	}

	var submitNotification = function () {
		var dummydiv = document.createElement("html"); dummydiv.innerHTML = notifications.updates;
		var message = dummydiv.getElementsByClassName("body markdown-content")[0].innerText.trim().substring(0, 125) + " ...";
		var url = dummydiv.getElementsByTagName("a")[2].getAttribute("href");
		var options = {
			title: "You have a new notification!",
			message: message,
			contextMessage: "Read more...",
			type: "basic",
			iconUrl: "images/icon48.png",
			isClickable: true
		};
		chrome.notifications.create("boardfication_"+url, options);
	}

	var getOptions = function () {
		chrome.storage.sync.get({
    		updateDelay: 15,
    		enableNotifications: true
  		}, function(items) {
    		options['updateDelay'] = items.updateDelay;
    		options['enableNotifications'] = items.enableNotifications;
  		   }
  		);
	}

	chrome.notifications.onClicked.addListener( function (id) {
		if ( id.search("boardfication") != -1 ) {
			chrome.notifications.clear(id);
			var url = "http://boards.las.leagueoflegends.com"+id.replace("boardfication_", "");
			var options = {
				url: url,
				active: true
			};
			chrome.tabs.create(options);
		}
	});

	updateBadge("...", true);
	getOptions();
	updateNotifications();
});