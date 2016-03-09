var startTime;
var emoticons = {};
function getData (loop) {
	$("body").html("");
	$.getJSON( "/json", function( data ) {
		convertData(data);
	});
}

function convertData(data) {
	var key = Object.keys(data);
	console.log(key);
	for (var i = 0; i < key.length; i++) {
		var key2 = Object.keys(data[key[i]]);
		//console.log(key2);
		for (var ii = 0; ii < key2.length; ii++) {
			//returnData.push({value:data[key[i]][key2[ii]], label: key2[ii]});
			var imageData = getEmoticon(key[i], key2[ii]);
			var item = $(".emoteBox[name=" + key2[ii] + "]");
			if(item.length > 0){
				var obj = item.find(".nr");
				var val = parseInt(obj.text());
				obj.text(val +data[key[i]][key2[ii]]);
			}else{
				$("body").append('<div class="emoteBox" name="'+key2[ii]+'"><img src="'+imageData+'"><p>'+key2[ii]+'</p><p class="nr">'+ data[key[i]][key2[ii]] +'</p></div>')
			}
		};
	};
	var divList = $(".emoteBox");
	divList.sort(function(a, b){ return $(b).find(".nr").text()-$(a).find(".nr").text()});

	$("body").html(divList);

	$("body").append('<button id="refresh">refresh</button>');
}
window.onload = function(){
	$.getJSON( "/emoticons", function( data ) {
		//{startTime: startTime, channels: settings.channels, emoticons: emoticons}
		startTime = data.startTime;
		channels = data.channels;
		for (var i = 0; i < data.channels.length; i++) {
			emoticons[data.channels[i]] = data.emoticons[i];
		};
	});
	getData(false);
	
	$( "body" ).on( "click", "#refresh", function() {
		getData(false);
	});
};
function getEmoticon (channel, match) {
	var a = emoticons[channel];
	for (var i = 0; i < a.length; i++) {
		if (match == a[i].regex) {
			return a[i].url;
		};
	};
}