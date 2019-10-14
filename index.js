'use strict';
const PAGE_ACCESS_TOKEN = "EAARobDlt2xYBALrIQzmqZCKxZBlBi4Yrt2AjtKjTm62ekqJw8ZA46XJMYBLOT5rHdAdFgn4dHOtsjmXHMoIxfqZBVCfZCJGhl0GPZAaEYDSQpIZBpTmYmpRTzWdzm53DqZCckdr4rfCg7x4cu8tKZAQdszIDNbZAFCudw3B9Idh2d4p9BtIDjJZAVLw";
// Imports dependencies and set up http server
const PAGE_ACCESS_TOKEN1 = "EAAipAcs4AvgBABkyXYqFpzTlpFCFY6wrxyyoA4KJoOTmoBfEh6KmKdsJp3QU37SZCx0XMYxCRXuLBoK8dovRp3itPLUQpOdHwV6ThUTz6dbcp0qOEaXF6";
const PAGE_ACCESS_TOKEN3 = "e25cece80fde8770a5de54f1da7ee777";
const PAGE_ACCESS_TOKEN2 = "EAAipAcs4AvgBANa4UlFcinWZBIhlUuMHPrcG6VSgpQSRImZBNQH7e1Aeu8oZBMPSeIBb0fbZAM95dioXdNKpFigUD9PCD6iTWAfYEXjjddAtlRKgpAGZAEZBkXXHJaULaJH8dzAQZCkbZCcsRrbYpwma5tWX6LMOcOpZAltFCnYrRVlmvMihBaIw60mmBFGUgYVYZD";

var re = "I SEND BUT NOT CONFORM ";

const
    request = require('request'),
    express = require('express'),
    body_parser = require('body-parser'),
    app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening on port :: 1337 '));

// Accepts POST requests at /webhook endpoint
app.get('/getName', (req, res) => {
    res.status(200).send('AYUS');
});
app.post('/facebook', (req, res) => {

	 console.log(" IN POST ");
    // Parse the request body from the POST
    let body = req.body;
    try {


        // Check the webhook event is from a Page subscription
        if (body.object === 'page') {

            body.entry.forEach(function(entry) {
                console.log(" IN LOOP ");
                // Gets the body of the webhook event
                let webhook_event = entry.messaging[0];
                console.log(webhook_event);


                // Get the sender PSID
                let sender_psid = webhook_event.sender.id;
                console.log('Sender ID: ' + sender_psid);

                // Check if the event is a message or postback and
                // pass the event to the appropriate handler function
                if (webhook_event.message) {
                    console.log("IN  webhook_event.message");
                    //console.log(webhook_event.message);
                    handleMessage(sender_psid, webhook_event.message);
                } else if (webhook_event.postback) {

                    console.log("IN  webhook_event.postback");
                    handlePostback(sender_psid, webhook_event.postback);
                }

            });
            // Return a '200 OK' response to all events
            //res.status(200).send('EVENT_RECEIVED');
            res.status(200).send(re);

        } else {
            // Return a '404 Not Found' if event is not from a page subscription
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.status(200).send(" ERROR IN PROCESS ");
    }

});

// Adds support for GET requests to our webhook
app.get('/facebook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "innoeye"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    console.log(mode, token, challenge);
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

function handleMessage(sender_psid, received_message) {
    let response;

    console.log("IN handleMessage(-,-)")
        // Checks if the message contains text
    if (received_message.text) {

        console.log("IN handleMessage(-,-) IN  received_message.text")
        console.log(received_message.text)
            // Create the payload for a basic text message, which
            // will be added to the body of our request to the Send API
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
        }
    } else if (received_message.attachments) {
        console.log("IN handleMessage(-,-) IN  received_message.attachments")
            // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [{
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }

    // Send the response message
    callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
    console.log('ok')
    let response;
    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
    // Construct the message body
    console.log(" IN callSendAPI(-,-) ");
    //let s = "t_2490945067658452";
    //s = 106868380704298; //102753501143323
    //s = 2437624983192312;   //2437624983192312
    //s = 102753501143323124; // 102753501143323
    //s = 2376428279136810;
    //s = 2361081954019197;
    //s = 2625243360874606;

    console.log("ID : " + `"${sender_psid}"`);
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    console.log(" IN callSendAPI(-,-) Request PrePare ");
    // console.log(" IN callSendAPI(-,-) PAGE_ACCESS_TOKEN " + PAGE_ACCESS_TOKEN);

    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN3 },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            re = res.body;
            console.log(res.body);
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}