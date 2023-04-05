const express = require('express');
const axios = require('axios');
const router = express.Router();

const twitchConf = require('../config/twitchconf.json')

router.route('/:streamerName')
.get(async(req, res) => {    
    let axiosInstance = axios.create(
        {
            headers: {
                Authorization: `Bearer ${twitchConf['access_token']}`,
                'Client-Id': `${twitchConf['client_id']}`
            }
        }
    )
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