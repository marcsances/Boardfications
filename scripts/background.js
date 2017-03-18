notifications = [];
exists = [];

options = [];
	
notification = false;

document.addEventListener("DOMContentLoaded", function() {
	var updateNotifications = function () {
		var xhr = new XMLHttpRequest();
		
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
			    	var cache = resp;
			    	var unread_notif = String(resp.searchResultsCount) || String(resp.resultsCount);
			    	updateBadge(unread_notif);
			    }

				var cache = cache.updates.replace(/<img\b[^>]*>/ig, '');
				var cache = cache.replace(/href="(.*?)(?=".*?)/ig, 'href="http://boards.las.leagueoflegends.com$1');
				
				var html = document.createElement("html"); html.innerHTML = cache;
				
				var a = html.getElementsByClassName("update-item");
				
				for(var i = 0; i<a.length; i++) {
					var item = a[i];
					
					var board = item.getAttribute("data-application-id");
					var discussion = item.getAttribute("data-discussion-id");
					var comment = item.getAttribute("data-comment-id");
					
					var parentComment = (item.children[0].getElementsByClassName("content")[0].textContent).trim(); //dont save
					var parentDiscussion = item.children[0].getElementsByTagName("a")[0].textContent;
					var parentDiscussion_url = item.children[0].getElementsByTagName("a")[0].href;
					
					var profile_url = item.children[1].getElementsByClassName("header byline clearfix")[0].getElementsByClassName("inline-profile ")[0].getElementsByTagName("a")[0].href;
					var profile_sn = item.children[1].getElementsByClassName("header byline clearfix")[0].getElementsByClassName("inline-profile ")[0].getElementsByClassName("username")[0].textContent;
					var server = item.children[1].getElementsByClassName("header byline clearfix")[0].getElementsByClassName("inline-profile ")[0].getElementsByClassName("realm")[0].textContent;
					var timeago = item.children[1].getElementsByClassName("header byline clearfix")[0].getElementsByClassName("timeago")[0].title;
					var url = item.children[1].getElementsByClassName("footer")[0].getElementsByClassName("right")[0].getElementsByTagName("a")[0].href;
					
					var isRioter = (typeof item.children[1].getElementsByClassName("header byline clearfix")[0].getElementsByClassName("inline-profile isRioter")[0] !== "undefined" && true || false);
					var whole = item.children[1].getElementsByClassName("body markdown-content")[0];
					
					if (!whole) { //message deleted
						whole = "Content deleted"; 
					} else {
						whole = whole.textContent;
					}
					
					var message = (whole.split(parentComment)[1] || whole).trim();
					
					exists[`${discussion}:${comment}`] = true;
					if (!notifications[discussion+":"+comment]) {
						notifications[`${discussion}:${comment}`] = [board, discussion, comment, parentDiscussion, parentDiscussion_url, profile_url, profile_sn, server, timeago, url, message, isRioter];
						
						if (notification === true && options["enableNotifications"]) {
							submitNotification(message, url)
						}
					}
				}

				for (key in notifications) {
					n = exists[key];
					if (!n) {
						notifications[key] = undefined;
						exists[key] = undefined;
					}
				}
				notification = true;
				exists = [];
		  	}
		  }
		}
		xhr.ontimeout = function () { 
			updateBadge("ERR", true)
		}
		if (!navigator.onLine) { xhr.ontimeout(); } else { xhr.send(); }
		chrome.cookies.get( 
			{ url : "http://boards.las.leagueoflegends.com", name: "APOLLO_TOKEN"},
			function (ck) {
				if ( ck ) {
					cookie = ck.value
				}
			}
		);
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

	var submitNotification = function (message, url) {
		message = (message.length > 128 && message.substring(0, 128-3) + "..." || message)
		var options = {
			title: "You have a new notification!",
			message: message,
			contextMessage: "Read more...",
			type: "basic",
			iconUrl: "images/icon48.png",
			isClickable: true
		};
		chrome.notifications.create("Boardfications_"+url, options);
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
		if ( id.search("Boardfications_") != -1 ) {
			chrome.notifications.clear(id);
			var url = id.replace("Boardfications_", "");
			var options = {
				url: url,
				active: true
			};
			chrome.tabs.create(options);
		}
	});

	setAsRead = function (comments) {
		comments["apolloToken"] = cookie;
		var xhr = new XMLHttpRequest();		
		xhr.open('PUT', 'http://boards.las.leagueoflegends.com/api/myupdates');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		xhr.onload = function() {
			if (xhr.status === 200) {
				updateNotifications();
			}
		};
		xhr.send(serialize(comments));
	};
	
	serialize = function(obj) {
		var str = [];
		for(var p in obj)
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
		return str.join("&");
	}

	updateBadge("...", true);
	getOptions();
	updateNotifications();
});

