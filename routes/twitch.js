const fs = require('fs');
const path = require('path');
const express = require('express');
const axios = require('axios');
const router = express.Router();

const twitchConf = require('../config/twitchconf.json');
const twitchCreds = require('../config/twitchcreds.json');

//TODO: do setTimeout in the future (when on a server)
async function requestNewToken() {
   const credentials = {
    "access_token": null,
    "expires_in": 0,
    "token_type": null,
    "expiry_date": 0
   }
   let axiosInstance = axios.create(
    {
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    }
   );
   
   let response = await axios.post(
        `https://id.twitch.tv/oauth2/token`,
        {
            client_id: twitchCreds['client_id'],
            client_secret: twitchCreds['client_secret'], 
            grant_type: "client_credentials"
        },
        {
            headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
        }
    );

    if (response.data) {
        try {
        credentials['access_token'] = response.data.access_token
        credentials['expires_in'] = response.data.expires_in
        credentials['token_type'] = response.data.token_type 
        } catch(e) {
            throw new Error(`Missing ${e}`);
        }
    }
    
    let expires = Date.now() + credentials['expires_in'];
    console.log(`Now: ${Date.now()}, Expires_in: ${credentials['expires_in']}`)
    credentials.expiry_date = expires;

    fs.writeFileSync(path.resolve(__dirname, '../config/twitchconf.json'), JSON.stringify(credentials))
}

router.route('/:streamerName')
.get(async(req, res) => {    
    // Look at the expiry date of current token if it exists
    // if it exists have we passed that date/time
    //      if yes : get new token and save stuff
    //         no  : use current token
    // if not exists get a new token and store the expiry date (by calculating) and other things
    if (twitchConf['expiry_date']) {
        console.log(twitchConf['expiry_date']);
        if (twitchConf['expiry_date'] + 60000 < Date.now()) { // if we're within 1 minute of expiration
            // request new token
            await requestNewToken();
        }
    }
    else {
        await requestNewToken();
    }
    let axiosInstance = axios.create(
        {
            headers: {
                Authorization: `Bearer ${twitchConf['access_token']}`,
                'Client-Id': `${twitchCreds['client_id']}`
            }
        }
    );
    // if (req.body.uploaderName) {
    //     // is this user allowed to upload for this streamer
    //     // verify user by getting
    //     // TODO: may require some app user and buy-in from the streamer

    // } 
    // else {
    //     // is this a real streamer on twitch
    if (!req.params.streamerName) {
        res.status(400).send({error: "Need name of streamer to check"});
    }

    let response = axiosInstance({
        method: 'GET',
        url: `https://api.twitch.tv/helix/users?login=${req.params.streamerName}`
        })
        .then((response) => {
            if (response.data.data.length == 1){
                res.status(200).send({data: true});
            }
            else if (response.data.data.length == 0){
                res.status(200).send({data: false});
            }
            else {
                res.status(400).send({error: "A REALLY bad request"});
            }
        })
        .catch((error) => {
            if (error.response.status == 404) {
                res.status(200).send({data: false});
                return;
            }
            else {
                res.status(400).send({error: `Something went wrong: ${error.response.statusText}`});
                return;
            }
        })
        ;
    }
    // }
);

module.exports = router;