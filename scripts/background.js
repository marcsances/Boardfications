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
	
// Retrieve champion ID from champion key
// http://ddragon.leagueoflegends.com/cdn/6.22.1/data/en_US/champion.json
// for(var k in str['data']) { console.log( "list["+str['data'][k]['key'] + "] = '" + str['data'][k]['id'] +"'") }

champions = []

champions[266] = 'Aatrox'
champions[103] = 'Ahri'
champions[84] = 'Akali'
champions[12] = 'Alistar'
champions[32] = 'Amumu'
champions[34] = 'Anivia'
champions[1] = 'Annie'
champions[22] = 'Ashe'
champions[136] = 'AurelionSol'
champions[268] = 'Azir'
champions[432] = 'Bard'
champions[53] = 'Blitzcrank'
champions[63] = 'Brand'
champions[201] = 'Braum'
champions[51] = 'Caitlyn'
champions[69] = 'Cassiopeia'
champions[31] = 'Chogath'
champions[42] = 'Corki'
champions[122] = 'Darius'
champions[131] = 'Diana'
champions[119] = 'Draven'
champions[36] = 'DrMundo'
champions[245] = 'Ekko'
champions[60] = 'Elise'
champions[28] = 'Evelynn'
champions[81] = 'Ezreal'
champions[9] = 'FiddleSticks'
champions[114] = 'Fiora'
champions[105] = 'Fizz'
champions[3] = 'Galio'
champions[41] = 'Gangplank'
champions[86] = 'Garen'
champions[150] = 'Gnar'
champions[79] = 'Gragas'
champions[104] = 'Graves'
champions[120] = 'Hecarim'
champions[74] = 'Heimerdinger'
champions[420] = 'Illaoi'
champions[39] = 'Irelia'
champions[427] = 'Ivern'
champions[40] = 'Janna'
champions[59] = 'JarvanIV'
champions[24] = 'Jax'
champions[126] = 'Jayce'
champions[202] = 'Jhin'
champions[222] = 'Jinx'
champions[429] = 'Kachampionsa'
champions[43] = 'Karma'
champions[30] = 'Karthus'
champions[38] = 'Kassadin'
champions[55] = 'Katarina'
champions[10] = 'Kayle'
champions[85] = 'Kennen'
champions[121] = 'Khazix'
champions[203] = 'Kindred'
champions[240] = 'Kled'
champions[96] = 'KogMaw'
champions[7] = 'Leblanc'
champions[64] = 'LeeSin'
champions[89] = 'Leona'
champions[127] = 'Lissandra'
champions[236] = 'Lucian'
champions[117] = 'Lulu'
champions[99] = 'Lux'
champions[54] = 'Malphite'
champions[90] = 'Malzahar'
champions[57] = 'Maokai'
champions[11] = 'MasterYi'
champions[21] = 'MissFortune'
champions[62] = 'MonkeyKing'
champions[82] = 'Mordekaiser'
champions[25] = 'Morgana'
champions[267] = 'Nami'
champions[75] = 'Nasus'
champions[111] = 'Nautilus'
champions[76] = 'Nidalee'
champions[56] = 'Nocturne'
champions[20] = 'Nunu'
champions[2] = 'Olaf'
champions[61] = 'Orianna'
champions[80] = 'Pantheon'
champions[78] = 'Poppy'
champions[133] = 'Quinn'
champions[33] = 'Rammus'
champions[421] = 'RekSai'
champions[58] = 'Renekton'
champions[107] = 'Rengar'
champions[92] = 'Riven'
champions[68] = 'Rumble'
champions[13] = 'Ryze'
champions[113] = 'Sejuani'
champions[35] = 'Shaco'
champions[98] = 'Shen'
champions[102] = 'Shyvana'
champions[27] = 'Singed'
champions[14] = 'Sion'
champions[15] = 'Sivir'
champions[72] = 'Skarner'
champions[37] = 'Sona'
champions[16] = 'Soraka'
champions[50] = 'Swain'
champions[134] = 'Syndra'
champions[223] = 'TahmKench'
champions[163] = 'Taliyah'
champions[91] = 'Talon'
champions[44] = 'Taric'
champions[17] = 'Teemo'
champions[412] = 'Thresh'
champions[18] = 'Tristana'
champions[48] = 'Trundle'
champions[23] = 'Tryndamere'
champions[4] = 'TwistedFate'
champions[29] = 'Twitch'
champions[77] = 'Udyr'
champions[6] = 'Urgot'
champions[110] = 'Varus'
champions[67] = 'Vayne'
champions[45] = 'Veigar'
champions[161] = 'Velkoz'
champions[254] = 'Vi'
champions[112] = 'Viktor'
champions[8] = 'Vladimir'
champions[106] = 'Volibear'
champions[19] = 'Warwick'
champions[101] = 'Xerath'
champions[5] = 'XinZhao'
champions[157] = 'Yasuo'
champions[83] = 'Yorick'
champions[154] = 'Zac'
champions[238] = 'Zed'
champions[115] = 'Ziggs'
champions[26] = 'Zilean'
champions[143] = 'Zyra'

});
