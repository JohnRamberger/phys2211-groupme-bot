var HTTPS = require('https');
const fs = require('fs');

var botID = process.env.BOT_ID;

function respond() {
	var request = JSON.parse(this.req.chunks[0]);
    if(request.sender_type == "bot"){
        //no communicating with other bots ;_;
        return;
    }
    //convert text obj to string
    var text = String(request.text).toLowerCase().trim();

    //load the json file
    var rawdata = fs.readFileSync('input.json');
    var input = JSON.parse(rawdata);

    var match = false;
    var i = 0;
    while(i < input.length){
        if(input[i].keywords.indexOf(text) >= 0){
            this.res.writeHead(200);
            postMessage(input[i].response);
            this.res.end();
            return;
        }
        i++;
    }

    console.log("message sent from " + request.name);
    this.res.writeHead(200);
    this.res.end();
}

function postMessage(_message) {
	var botResponse, options, body, botReq;

	botResponse = _message;

	options = {
		hostname: 'api.groupme.com',
		path: '/v3/bots/post',
		method: 'POST'
	};

	body = {
		"bot_id": botID,
		"text": botResponse
	};

	console.log('sending ' + botResponse + ' to botID');

	botReq = HTTPS.request(options, function (res) {
		if (res.statusCode == 202) {
			//neat
		} else {
			console.log('rejecting bad status code ' + res.statusCode);
		}
	});

	botReq.on('error', function (err) {
		console.log('error posting message ' + JSON.stringify(err));
	});
	botReq.on('timeout', function (err) {
		console.log('timeout posting message ' + JSON.stringify(err));
	});
	botReq.end(JSON.stringify(body));
}


exports.respond = respond;