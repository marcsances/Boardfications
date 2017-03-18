setTimeout(function() { 

var linkTag = document.createElement ("link"); linkTag.href = "/stylesheets/boards.css"; linkTag.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(linkTag);

setTimeout(function(){document.body.style = "visibility:visible"}, 500)

var notifications = chrome.extension.getBackgroundPage().notifications;
var champions = chrome.extension.getBackgroundPage().champions;

if ( Object.keys(notifications).length > 0) {
	
	var source = "";
	for(key in notifications) {
		var item = notifications[key];
		
		var board = item[0];
		var discussion = item[1];
		var comment = item[2];
		var parentDiscussion = item[3];
		var parentDiscussion_url = item[4];
		var profile_url = item[5];
		var profile_sn = item[6];
		var server = item[7];
		var timeago = item[8];
		var url = item[9];
		var message = item[10];
		var isRioter = item[11];
		
		var avatar = isRioter && `/images/riot_fist.png` || `https://avatar.leagueoflegends.com/las/${profile_sn}.png`;
		var fontcolor = isRioter && `<font color=#ae250f> ${profile_sn} </font>` || profile_sn;
		source = source + 
		`<div class='update-item' data-application-id=${board} data-discussion-id=${discussion} data-comment-id=${comment}>
			<div class='parent-comment'> 
				<span class='in'>en</span> 
				<a href=${parentDiscussion_url} target='_blank'>${parentDiscussion}</a> 
			</div>
			<div class='comment clearfix'> 
				<div class='header byline clearfix'> 
					<div class='inline-profile'>
						<a href=${profile_url} target='_blank'>
							<span class='icon'>
								<img src=${avatar}>
							</span>
							<span class='username'>
								${fontcolor}
							</span>
						</a>
						<span class='realm'>
							${server}
						</span>
					</div>
					<span class='timeago' title=${timeago}> </span> 
				</div>
				<div class='body markdown-content'>
					${message}
				</div> 
				<div class='footer'>
					<div class='right'>
						<a href=${url} target='_blank'>Ir a comentario</a>
					</div> 
				</div> 
			</div> 
		</div>`
		document.getElementById("my-updates").innerHTML = source;
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
	var a = document.getElementsByClassName("update-item")
	var comments = {};

	comments["readState"] = "true"
	
	for(var i = 0; i<a.length; i++) {
		var item = a[i];
		var board = item.getAttribute("data-application-id");
		var discussion = item.getAttribute("data-discussion-id");
		var comment = item.getAttribute("data-comment-id");
		
		comments[`comments[${board}][${discussion}][]`+" ".repeat(i+1)] = comment;
	}	
	chrome.extension.getBackgroundPage().setAsRead(comments);
};

document.getElementById("about").onclick = function() {
	var disclaimer = document.getElementById("disclaimer");
	if ( disclaimer.style["display"] == "none" || !disclaimer.style["display"] ) {
		disclaimer.style = "display: inline-block";
		window.scrollTo(0, window.innerHeight);
	} else {
		disclaimer.style = "display: none";
	}
};
}, 0.1)