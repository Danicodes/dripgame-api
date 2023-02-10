const express = require('express');
const router = express.Router();

const axios = require('axios');

router.route('/download')
.get(async(req, res) => {
    var url = req.query.url;
    let response = axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    }).then(function(response) {
        response.data.pipe(res)
    });
    //res.status(200).send(response);
});

module.exports = router;