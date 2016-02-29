var request = require("request")

getEmoticons = function (channel) {
	channel = channel.replace("#", "");
	var emoticons = [];

	var url = "https://api.twitch.tv/kraken/chat/"+channel+"/emoticons.json"

	request({
	    url: url,
	    json: true
	}, function (error, response, data) {

	    if (!error && response.statusCode === 200) {
	        if (data.emoticons.length > 0) {
				for (var i = 0; i < data.emoticons.length; i++) {
					emoticons.push({"regex":data.emoticons[i].regex, "url": data.emoticons[i].url});
				};
			};
	    }
	})
	console.log("load emoticons");
	return emoticons;
}

getEmoticonsDefualt = function () {
	var emoticons = [];

	var url = "https://api.twitch.tv/kraken/chat/emoticons.json"

	request({
	    url: url,
	    json: true
	}, function (error, response, data) {

	    if (!error && response.statusCode === 200) {
	        if (data.emoticons.length > 0) {
				for (var i = 0; i < data.emoticons.length; i++) {
					emoticons.push({"regex":data.emoticons[i].regex, "url": data.emoticons[i].images[0].url});
				};
			};
	    }
	})
	console.log("load emoticons");
	return emoticons;
}