var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var emoticons = [];

require('./getEmoticons');

var irc = require("irc");
var settings = {
	channels : ["#summit1g"],
	server : "irc.twitch.tv",
	port: 6667,
	secure: false,
	nick : "****",
	password : "****"
}
emoticons.push(getEmoticonsDefualt());
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


app.use("/", express.static(__dirname + '/'));
app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
	socket.emit("channels", settings.channels);
  	console.log('a user connected');
});

http.listen(3000, function(){
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
	getEmoticonsFromMessage(message);
	//bot.say(settings.channels[0], data);
});

function getCommand (message) {
	var mess = message.split("!");
	if (mess.length > 1) {
		mess = mess[1].split(" ");
		if (mess.length > 0) {
			
			return;
		}
	}
	return;
}
function getEmoticonsFromMessage(message) {
	var mess = message.split(" ");
	for (var i = 0; i < mess.length; i++) {
		for (var ii = 0; ii < emoticons.length; ii++) {
			for (var iii = 0; iii < emoticons[ii].length; iii++) {
				if (mess[i] == emoticons[ii][iii].regex) {
					io.emit('update', emoticons[ii][iii]);
				};
			};
		};
	};
}