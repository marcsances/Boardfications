notifications = "blank";
notifications_c = "blank";
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
				    // Bugfix #1
				    if ( isArray(notifications_c) && isArray(notifications) && unread_notif != "0") {
				    	if ( a || b ) {
				    		    a.parentNode.removeChild(a);
				    		    b.parentNode.removeChild(b);
				    	}

				    	// Prevent images from loading and taking unnecesary resources
				    	var noimage = notifications.updates.replace(/<img\b[^>]*>/ig, '');
				    	var noimage_c = notifications_c.updates.replace(/<img\b[^>]*>/ig, '');

					    var a = document.createElement("html"); a.innerHTML = noimage;
					    a = a.getElementsByClassName("body markdown-content");
					    var b = document.createElement("html"); b.innerHTML = noimage_c;
					    b = b.getElementsByClassName("body markdown-content");

				    	for (i=0; i<a.length; i++) {
				    		if ( a[i] && a[i].textContent ) {
				    			if ( (!b[i] || !b[i].textContent) || (a[i].textContent != b[i].textContent) ) {
				    				submitNotification(i);
				    				console.log("diff " + i);
				    				break;
				    			}
				    		}
				  		}
				    }
				    notifications_c = notifications;
			    }
		  	}
		  }
		}
		xhr.ontimeout = function () { 
			updateBadge("ERR", true)
		}
		if (!navigator.onLine) { xhr.ontimeout(); } else { xhr.send(); }
		updateTimer();
	};

	var updateTimer = function () {
		setTimeout(updateNotifications, options['updateDelay']*1000);
	};

	var updateBadge = function (text, error) {
		if ( error ) {
			chrome.browserAction.setBadgeBackgroundColor({ color: [255, 20, 20, 255] });
		} else {
			if ( text == "0" ) {
				chrome.browserAction.setBadgeBackgroundColor({ color: [20, 20, 255, 255] });
			} else {
				chrome.browserAction.setBadgeBackgroundColor({ color: [0, 150, 0, 255] });
			}
		}
		chrome.browserAction.setBadgeText({text: text});
	};

	var isArray = function (object) {
		return typeof object === "object";
	};

	var submitNotification = function (index) {
		var index = index || 0;
		var dummydiv = document.createElement("html"); dummydiv.innerHTML = notifications.updates.replace(/<img\b[^>]*>/ig, '');
		var message = dummydiv.getElementsByClassName("body markdown-content")[index].innerText.trim().substring(0, 125) + " ...";
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
	};

	var getOptions = function () {
		chrome.storage.sync.get({
    		updateDelay: 10,
    		enableNotifications: true
  		}, function(items) {
    		options['updateDelay'] = items.updateDelay;
    		options['enableNotifications'] = items.enableNotifications;
  		   }
  		);
	};

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

	// Bugfix #2
	popup_Clear = function (id) {
		tempId = id;
		chrome.tabs.onUpdated.addListener(
			function(tabId, info) {
				if (tabId == tempId && info.status == "complete") {
					chrome.tabs.remove(tempId);
				}
			}
		);
	};

	updateBadge("...", true);
	getOptions();
	updateNotifications();
});