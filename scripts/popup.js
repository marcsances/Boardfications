var notifications = chrome.extension.getBackgroundPage().notifications;
var regex = [
	[/(\>) (\[){.+?(> >)/g, ""],
	[/champion:(\d+)/g, "", "champion"]
	[/{{.+?}}/g, ""]
];

// 54 bytes = empty/base json
if (notifications.updates.length > 54) {

	document.getElementById("my-updates").innerHTML = notifications.updates;

	var a = document.getElementById('my-updates').getElementsByTagName('a');
	for (var i=0; i<a.length; i++){
		a[i].setAttribute('target', '_blank');
		var cur = a[i].getAttribute('href');
		if ( cur.search("//") == -1 ) {
			a[i].setAttribute('href', "http://boards.las.leagueoflegends.com"+cur);
		}
	}
	
	var c = document.getElementsByClassName("content");
	var c_c = [];
	
	for (var i=0; i<c.length; i++) {
		c_c[i] = c[i].innerText.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
	}

	var b = document.getElementsByClassName("body markdown-content");
	for(var i=0; i<b.length; i++) {
		if ( b[i].innerText.search(c_c[i]) != -1 ) {
			b[i].innerText = b[i].innerText.replace(c_c[i], "");
		}
		for(var k=0; k<regex.length; k++) {
			var cur = b[i].innerText;
			if ( cur.search(regex[k][0]) != -1 ) {
				if ( regex[k][2] ) { // replace with champions icon
					if ( regex[k][2] == "champion" ) {
						var champion_id = cur.match(regex[k][0])[2]
						var champion_name = champions[champion_id]
						b[i].innerText = cur.replace(regex[k][0], "<img src='http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/"+ champion_name + ".png' </img>");
						continue;
					}
				}
				b[i].innerText = cur.replace(regex[k][0], regex[k][1]);
			}
		}
	}
}

document.getElementById("settings").onclick = function() {
  	if (chrome.runtime.openOptionsPage) {
    		chrome.runtime.openOptionsPage();
  	} else {
    		window.open(chrome.runtime.getURL('options.html'));
  	}
};

document.getElementById("clear").onclick = function() {
  	if (chrome.tabs.create) {
  		var url = "http://boards.las.leagueoflegends.com/es/myupdates";
		var options = {
			url: url,
			active: false
		};

		chrome.tabs.create(options,
			function (tabId) {
				chrome.extension.getBackgroundPage().popup_Clear(tabId.id);
			}
		);
  	}
};

document.getElementById("about").onclick = function() {
	var disclaimer = document.getElementById("disclaimer");
	if ( disclaimer.getAttribute("data-visible") == "0" ) {
		disclaimer.style = "display: inline-block";
		disclaimer.setAttribute("data-visible", "1")
	} else {
		disclaimer.style = "display: none";
		disclaimer.setAttribute("data-visible", "0")
	}
};
