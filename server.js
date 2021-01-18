/**
 * Install these packages
 */
const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');

/**
 * Initialize
 */
const app = express();
app.use(bodyParser.text({ type: 'json' }));

/**
 * Set a port
 */
const port = 3000;

/**
 * Get your Api-Token from your Sendbird Dashboard (https://dashboard.sendbird.com)
 */
const SENDBIRD_API_TOKEN = 'REPLACE-WITH-YOUR-API-TOKEN';

/**
 * For any sent message or any other event you do using your account,
 * Sendbird will send you a POST request to your Dashboard
 */
app.post('/', async (req, res) => {

    console.log('Headers (you can see x-sendbird-signature here):');
    console.log(req.headers);
    
    isSendbirdCorrectCall(req.headers['x-sendbird-signature'], req.body, res);
})

/**
 * This function will validate if this payload was sent from Sendbird
 */
function isSendbirdCorrectCall(signature, body, res) {
    const hash = crypto
        .createHmac('sha256', SENDBIRD_API_TOKEN)
        .update(body)
        .digest('hex');
    
    /**
     *  Check if the value of the 'x-sendbird-signature' request header is the same 
     * as the comparison value you've created.
     */ 
    signature == hash ? res.status(200).send({ success: true }) : res.status(401).send({ success: false });  
}

app.listen(port, () => console.log(`app is listening on port ${port}!`));

