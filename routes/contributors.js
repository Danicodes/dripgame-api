const express = require('express');
const router = express.Router();

const contributorData = require('../data/contributors');

router.route('/')
.get(async(req, res) => {
    try {
        let contributors = await contributorData.getContributors();
        res.status(200).send(contributors);
    }
    catch(e) {
        res.status(400).json({error: `UHOH... ${e} `});
    }
})
.post(async(req, res) => {
    let contributorObject = req.body.data;
    console.log(contributorObject);
    if (!contributorObject) {
        res.status(400).send({error: `Bad request: No 'data' attribute in request body`});
        return;
    }

    let { twitchUsername, instagramUsername, twitterUsername, website } = contributorObject;
    if (!twitchUsername) {
        res.status(400).send({error: `Bad request: object missing 'username' attribute`});
        return;
    }

    let newContributor;
    try {
        newContributor = await contributorData.createContributor(twitchUsername, instagramUsername, twitterUsername, website);
    } catch(e) {
        res.status(500).send({error: `${e}`});
        return;
    }

    try {
        let contributorObj = await contributorData.getContributorById(newContributor);
        res.status(200).send({data: contributorObj});
    }
    catch(e){
        res.status(500).send({error: `${e}`});
        return;
    }
});

router.route('/:contributorUsername')
.get(async(req, res) => {
    let contributorUsername = req.params.contributorUsername;
    try{
         let contributor = await contributorData.getContributorByUsername(contributorUsername);
         res.status(200).json(contributor);
    }   
    catch(e){
        res.status(500).json({error: `UHOH SPAGHETT`});
    }

});
// .post(async(req, res) => {
//     let contributor = req.body.contributor;

// });

module.exports = router;

