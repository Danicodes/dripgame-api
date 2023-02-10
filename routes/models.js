const express = require('express');
const { models } = require('../config/mongoCollections');
const router = express.Router();

const modelsData = require('../data/models');

router.route('/')
.get(async(req, res) => {
    if (req.query.id){
        let id = req.query.id;
        try{
            let model = await modelsData.getModelById(id);
            res.send({data: model});
        }
        catch(e) {
            res.status(400).send(`Bad things happened: ${e}`);
        }
    }
    else if (req.query.username){
        let username = req.query.username;
        
        try {
            let model = await modelsData.getModelByUsername(username);
            res.send({data: model});
        }
        catch(e) {
            res.status(400).send(`Bad things happened... again: ${e}`);
        }
    }
    else {
        try {
            let models = await modelsData.getAllModels();
            res.status(200).send({data: models});
        } catch(e) {
            res.status(500).send({error: `Uhoh spaghetttioooooo ${e}`})
        }
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

// // router.route('/')
// // .get(async(req, res) => {
// //     if (req.query.id){
// //         let modelId = req.query.id;
// //         try {
// //             let modelObj = await modelsData.getModelById(modelId);
// //             res.status(200).send({data: modelObj});
// //         }
// //         catch(e) {
// //             res.status(500).send({error: `... ${e}`});
// //         }
// //     }
// //     else if (req.query.username) {
// //         let username = req.query.username;
// //         try {
// //             let modelObj = await modelsData.getModelByUsername(modelUsername);
// //             res.status(200).send({data: modelObj});
// //         }
// //         catch(e){
// //             res.status(500).send({error: `Error: ${e}`});
// //         }
// //     }

// });

module.exports = router;