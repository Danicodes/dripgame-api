const express = require('express');
const router = express.Router();

const assetsData = require('../data/assets');

router
.route('/file/:assetUrl')
.get(async(req, res) => {
    let assetUrl = req.params.assetUrl;

    try {
        let asset = await assetsData.getAssetByUrl(assetUrl);
        res.status(200).send(asset);
    }
    catch(e) {
        res.status(500).json({message: `UH-OH...`});
    }
});

router
.route('/:assetId')
.get(async(req, res) => {
    let assetId = req.params.assetId;
    try {
        // validate some stuff
        console.log("");
    }
    catch(e) {
        res.status(400).json({message: `Invalid id ${e}`});
    }

    try {
        let asset = await assetsData.getAssetByID(assetId);
        console.log(asset);
        res.status(200).send(asset);
    }
    catch(e) {
        res.status(400).json({message: `You did something wrong, not me :) ${e}`});
    }
});

router
.route('/')
.get(async(req, res) => {
    let assets = await assetsData.getAssets();
    res.status(200).send(assets);
})
.post(async(req, res) => {
    let { modelID, category, label, file, twitchUsername, owner, assetExtra } = req.body.data;
    
    if (!modelID || !category || !label || !file || !twitchUsername || !owner){
        res.status(400).send({error: `Error: missing parameter must provide modelId, category, ....` });
        return;
    }
    try {
        let assetResult = await assetsData.createAsset(modelID, category, label, file, twitchUsername, owner, assetExtra);
        res.status(200).send({data: assetResult});
    }
    catch(e) {
        res.status(500).send({error: `Things broken oopsie ${e}`});
        return;
    }
});

router
.route('/:assetId/approve')
.put(async(req, res) => {
    let assetId = req.params.assetId;
    
    try {
        let approved = await assetsData.approveAsset(assetId);
        res.status(204)
    }
    catch(e) {
        res.status(500).json({error: `Dude idunno ${e}`});
        }
    } 
);

router.route('/:assetId/reject')
.put(async(req, res) => {
    let assetId = req.params.assetId;
    try {
        let rejected = await assetsData.rejectAsset(assetId);
        res.status(204) // should probs send some data tho
    }
    catch(e) {
        res.status(500).json({error: `Dude idunno ${e}`});
        }
    } 

);

router.route('/:assetId/update')
.put(async(req, res) => {
    let assetId = req.params.assetId;
    let updateObj = req.body.updateObject;

    try {
        let updatedObject = await assetsData.updateAsset(assetId, updateObj);
        res.status(200).send(updatedObject);
    }
    catch(e) {
        res.status(500).json({error: `An error has appeared! ${e}`});
    }
    }
);

module.exports = router;

