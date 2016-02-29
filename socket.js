var socket = io.connect();

socket.on('update', function(data) {
	var item = $(".emoteBox[name=" + data.regex + "]");
	if(item.length > 0){
		var obj = item.find(".nr");
		var val = parseInt(obj.text());
		obj.text(++val);
	}else{
		$("body").append('<div class="emoteBox" name="'+data.regex+'"><img src="'+data.url+'"><p>'+data.regex+'</p><p class="nr">1</p></div>')
	}
	console.log("update");
});