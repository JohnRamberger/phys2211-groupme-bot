var HTTPS = require("https");
const fs = require("fs");
const db = require("./db.js");
const req = require("request");

var botID = process.env.BOT_ID;

async function respond() {
    var request = JSON.parse(this.req.chunks[0]);
    if (request.sender_type == "bot") {
        //no communicating with other bots ;_;
        return;
    }
    //convert text obj to string
    var text = String(request.text).toLowerCase().trim();

    //load the json file
    var rawdata = fs.readFileSync("input.json");
    var input = JSON.parse(rawdata);

    switch (text) {
        case "$quote":
        case "$motivation":
            try {
                this.res.writeHead(200);
                //get motivational quote
                let url = "https://zenquotes.io/api/random";

                req(url, { json: true }, (err, res, body) => {
                    if (err) {
                        return console.log(err);
                    }
                    let quote = body[0];
                    //delay sending of message to prevent predicting the future
                    setTimeout(() => {
                        postMessage(`${quote.q} —${quote.a}`);
                    }, 1000);

                    //console.log(body[0].q);
                    //console.log(body.url);
                    //console.log(body.explanation);
                });

                this.res.end();
                break;
            } catch (err) {
                console.log(err);
            }
        default:
            var match = false;
            var i = 0;
            while (i < input.length) {
                if (input[i].keywords.indexOf(text) >= 0) {
                    this.res.writeHead(200);
                    //delay sending of message to prevent predicting the future
                    setTimeout(() => {
                        postMessage(input[i].response);
                    }, 1000);
                    this.res.end();

                    //update statistics
                    /*await db.insert_command(request.user_id, text, new Date());
                    let count = await db.command_count(text) + 1;
                    console.log(`${text} command used ${count} times`);*/
                    return;
                }
                i++;
            }
            break;
    }

    console.log("message sent from " + request.name);
    this.res.writeHead(200);
    this.res.end();
}

function postMessage(_message) {
    var botResponse, options, body, botReq;

    botResponse = _message;

    options = {
        hostname: "api.groupme.com",
        path: "/v3/bots/post",
        method: "POST",
    };

    body = {
        bot_id: botID,
        text: botResponse,
    };

    console.log("sending " + botResponse + " to " + botID);

    botReq = HTTPS.request(options, function (res) {
        if (res.statusCode == 202) {
            //neat
        } else {
            console.log("rejecting bad status code " + res.statusCode);
        }
    });

    botReq.on("error", function (err) {
        console.log("error posting message " + JSON.stringify(err));
    });
    botReq.on("timeout", function (err) {
        console.log("timeout posting message " + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
}

exports.respond = respond;
