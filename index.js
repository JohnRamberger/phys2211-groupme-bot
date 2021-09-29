var http, director, bot, router, server, port;

http = require('http');
director = require('director');
bot = require('./bot.js');
const fs = require('fs');
var HTTPS = require('https');

router = new director.http.Router({
    '/': {
        post: bot.respond,
        get: ping
    }
});

server = http.createServer(function(req, res) {
    req.chunks = [];
    req.on('data', function(chunk) {
        req.chunks.push(chunk.toString());
    });

    router.dispatch(req, res, function(err) {
        res.writeHead(err.status, { "Content-Type": "text/plain" });
        res.end(err.message);
    });
});

port = Number(process.env.PORT || 5000);
server.listen(port);

function ping() {
    this.res.writeHead(200);
    this.res.end("Hey! the chatbot is currently running :)");
}

//setup announcements
var announcementsRaw = fs.readFileSync('announcements.json');
var ann = JSON.parse(announcementsRaw);
let interval = setInterval(() => {
    for (var a of ann) {
        var datetime = new Date(a.datetime);
        var now = new Date();
        var message = a.message;

        let difMins = getMinutes(datetime);
        console.log("a")
        console.log(difMins);

        if (now.getUTCFullYear() == datetime.getUTCFullYear() && now.getUTCMonth() == datetime.getUTCMonth() && now.getUTCDate() == datetime.getUTCDate()) {
            //on same day
            
            if (difMins == -60) {
                //due in 1 hour
                //postAnnouncement(datetime, "1 hour away:\n", message);
            } else if (difMins == -10){
                //due in 10 minutes
                //postAnnouncement(datetime, "10 minutes away:\n", message);
            }
        }
    }
}, 10 * 1000);

function getMinutes(_datetime) {
    var today = new Date();
    var diffMs = (today - _datetime); // milliseconds between now & Christmas
    var diffMins = Math.floor(diffMs / 1000 / 60);
    return diffMins;
}

var botID = process.env.BOT_ID;

function postAnnouncement(_datetime, _pre, _message) {
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

    console.log(`[${_datetime}] sent announcement  |${_message}|`);

    botReq = HTTPS.request(options, function(res) {
        if (res.statusCode == 202) {
            //neat
        } else {
            console.log('rejecting bad status code ' + res.statusCode);
        }
    });

    botReq.on('error', function(err) {
        console.log('error posting message ' + JSON.stringify(err));
    });
    botReq.on('timeout', function(err) {
        console.log('timeout posting message ' + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
}