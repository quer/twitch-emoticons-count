var express = require('express');
var app = express();
var emoticons = [];
var allEmoticons = {};
require('./getEmoticons');
var startTime = new Date();
var irc = require("irc");
var settings = {
	channels : ["#dkgamle", "#onscreenlol", "#nightblue3", "#imaqtpie"],
	server : "irc.twitch.tv",
	port: 6667,
	secure: false,
	nick : "mukuduk",
	password : "oauth:*********"
}
//emoticons.push(getEmoticonsDefualt());
for (var i = 0; i < settings.channels.length; i++) {
	emoticons.push(getEmoticons(settings.channels[i]));
};
console.log("done loading");
var bot = new irc.Client(settings.server, settings.nick, {
	channels: [settings.channels + " " + settings.password],
	debug: false,
	password: settings.password,
	username: settings.nick
});


app.use("/", express.static(__dirname + '/site/'));
app.get('/', function(req, res){
  res.sendfile('test.html');
});

app.get('/json', function(req, res){
	res.setHeader("content-type", "application/json");
	res.send(JSON.stringify(allEmoticons));
});
app.get('/emoticons', function(req, res){
	res.setHeader("content-type", "application/json");
	res.send(JSON.stringify({startTime: startTime, channels: settings.channels, emoticons: emoticons}));
});

app.listen(3000, function(){
  console.log('listening on *:3000');
});


bot.addListener("join", function (channel, who) {
	if(who == "botName"){
		console.log(who + "recognized as joined.");
	}
	else {
		console.log(who + " joined the chat!");
		var mes = "Welcome to the channel, " + who + "!";
		bot.say(settings.channels[0], mes);
	}
});

bot.addListener("message", function (who, channel, message) {
	getEmoticonsFromMessage(message, channel);
	//bot.say(settings.channels[0], message);
});
function getEmoticonsFromMessage(message,channel) {
	var mess = message.split(" ");
	//console.log(channel);
	var ii = settings.channels.indexOf(channel);
	for (var i = 0; i < mess.length; i++) {
		//for (var ii = 0; ii < emoticons.length; ii++) {
			for (var iii = 0; iii < emoticons[ii].length; iii++) {
				if (mess[i] == emoticons[ii][iii].regex) {
					placeArray(emoticons[ii][iii].regex, settings.channels[ii]);
				};
			};
		//};
	};
}
function placeArray (emoticon, channel) {

	//console.log("ended here");
	//console.log(emoticon);
	//console.log(channel);
	if(typeof allEmoticons[channel] == "undefined"){
		allEmoticons[channel] = {};
	}
	if (typeof allEmoticons[channel][emoticon] == "undefined") {
		allEmoticons[channel][emoticon] = 0;
	};
	allEmoticons[channel][emoticon] += 1;
}