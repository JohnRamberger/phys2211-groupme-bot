var http, director, bot, router, server, port;

http = require('http');
director = require('director');
bot = require('./bot.js');
const fs = require('fs');

router = new director.http.Router({
    '/': {
        post: bot.respond,
        get: ping
    }
});

server = http.createServer(function (req, res) {
    req.chunks = [];
    req.on('data', function (chunk) {
        req.chunks.push(chunk.toString());
    });

    router.dispatch(req, res, function (err) {
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

var announcementsRaw = fs.readFileSync('announcements.json');
var ann = JSON.parse(announcementsRaw);
for(var a of ann){
    console.log(a);
}

function sendAnnouncement(){

}