const express = require('express');
const router = express.Router();

const modelsData = require('../data/models');

router.route('/')
.get(async(req, res) => {
    try {
        let models = await modelsData.getAllModels();
        res.status(200).send({data: models});
    } catch(e) {
        res.status(500).send({error: `Uhoh spaghetttioooooo ${e}`})
    }
})
.post(async(req, res) => {
    let modelUsername = req.body.username;
    if (!modelUsername) {
        res.status(400).send({error: `Bad request: request body missing 'username' attribute`})
        return;
    }

    let modelId;
    try {
        modelId = await modelsData.createModel(modelUsername);
    }
    catch(e) {
        res.status(500).send({error: `... ${e}`});
        return;
    }

    try {
        let modelObj = await modelsData.getModelById(modelId);
        res.status(200).send({data: modelObj});
    }
    catch(e) {
        res.status(500).send({error: `... ${e}`});
    }
});

router.route('/:modelId')
.get(async(req, res) => {
    let modelId = req.params.modelId;

    try {
        let modelObj = await modelsData.getModelById(modelId);
        res.status(200).send({data: modelObj});
    }
    catch(e) {
        res.status(500).send({error: `... ${e}`});
    }
});

router.route('/:modelUsername')
.get(async(req, res) => {
    let modelUsername = req.params.modelUsername;

    try {
        let modelObj = await modelsData.getModelByUsername(modelUsername);
        res.status(200).send({data: modelObj});
    }
    catch(e){
        res.status(500).send({error: `Error: ${e}`});
    }

});


module.exports = router;