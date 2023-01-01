const assetData = require('../data/assets');
const modelData = require('../data/models');
const contributorData = require('../data/contributors');

const { ObjectId } = require('mongodb');

async function testCreateOrGetModel(){
    let modelName = "testModel";
    let modelID;

    try {
        modelID = await modelData.createModel(modelName);
    }
    catch(e){
        modelID = await modelData.getModelByUsername(modelName);
        modelID = modelID._id;
        return;
    }
    return modelID;
}

async function testCreateAsset(modelID, contributorID){
    let createdAsset;
    
    try {
        createdAsset = await assetData.createAsset(
            modelID,
            assetCategory = "tops",
            assetLabel = "Testing API",
            assetImage = "https://placekitten.com/g/200/300",
            contributorID = contributorID,
            );
    }
    catch(e){
        console.log(`Error ${e}`);  
        return;
    }

    console.log(createdAsset);
}

async function testCreateOrGetContributor(contributorName){
    let contributorID;

    try{
        contributorID = await contributorData.createContributor(contributorName);
    }
    catch(e){
        contributorID = await contributorData.getContributorByUsername(contributorName);
        contributorID = contributorID._id;
        return;
    }

    return contributorID;
}

async function main(){
    let model;

    try {
        model = await testCreateOrGetModel();
    }
    catch(e){
        console.log(e);
        return;
    }

    let contributor;
    try {
        contributor = await testCreateOrGetContributor("girlwithbox");
    }
    catch(e){
        console.log(e);
        return;
    }

    if (model && contributor){
        let asset;
        try{
            asset = await testCreateAsset();
        }
        catch(e){
            console.log(e);
            return;
        }

        console.log("AssetID: " + asset);
    }
    return;
}

main();