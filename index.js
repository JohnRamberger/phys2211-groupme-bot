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

//setup announcements
var announcementsRaw = fs.readFileSync('announcements.json');
var ann = JSON.parse(announcementsRaw);
let interval = setInterval(() => {
    for(var a of ann){
        var datetime = new Date(a.datetime);
        var now = new Date();
        var message = a.message;

        console.log(`${now.getUTCFullYear()} = ${datetime.getUTCFullYear()}`)
        console.log(`${now.getUTCMonth()} = ${datetime.getUTCMonth()}`)
        console.log(`${now.getUTCDate()} = ${datetime.getUTCDate()}`)
        console.log(`${now.getUTCHours()} = ${datetime.getUTCHours()}`)
        console.log(`${now.getUTCMinutes()} = ${datetime.getUTCMinutes()}`)
        //console.log(`${now.getUTCFullYear()} = ${datetime.getUTCFullYear()}`)


        if(now.getUTCFullYear() == datetime.getUTCFullYear() && now.getUTCMonth() == datetime.getUTCMonth() && now.getUTCDate() == datetime.getUTCDate()){
            //on same day

            //announce 1 hour before due
            if(now.getUTCMinutes() == datetime.getUTCMinutes() && datetime.getUTCHours() - now.getUTCHours() == 1){
                sendAnnouncement(datetime, message);
            }
        }
    }
}, 60 * 1000);



function sendAnnouncement(datetime, message){
    console.log(`[${datetime}] sent message ${message}`);
}