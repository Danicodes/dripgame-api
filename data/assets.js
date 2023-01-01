const mongoCollections = require('../config/mongoCollections');
const assets = mongoCollections.assets;
const contributorsData = require('./contributors');
const modelData = require('./models');
//const validate = require('./validate'); -- create some validation checks somehow
const validate = require('./validations');
const { ObjectId } = require('mongodb');
const category = require('./assetCategory');

//TODO: Classes for defining the different types of assets and info associated with them
// Note develop and store files locally for now but def need to move to secure file uploads when live
// asset-category- ???? (dash)? case? kebab-case
// asset_category = snake_case
// assetCat = camel :3
/**
 *
 * @param {string} assetCategory - Tops, Bottoms, Suits, Shoes, Accessory, Model, 
 * @param {string} assetLabel - Short descriptive name of the item e.g Grey TeddyFresh Hoodie
 * @param {string} contributor - artist to credit with the creation of this asset
 * @param {string} filename - obtained/generated on download
 * @param {object} assetExtra - Object containing any extra data specific to the type of asset given - color, brand, style (anime,pixel...) etc
 */
async function createAsset(modelID, assetCategory, assetLabel, assetImage, contributorID, imageMetadata = null, assetExtra = {}){
    // TBD can we determine if a duplicate image is being uploaded?
    if (!assetCategory || !assetLabel || !assetImage || !contributorID || !modelID){
        throw "Error: must provide category, label, contributorID, and imageUrl";
    }

    assetCategory = validate.validateCategory(assetCategory);
    modelID = validate.validateId(modelID); // try to convert to object id, throw if invalid
    contributorID = validate.validateId(contributorID);

    // check model id -- Have to assume it was created prior 
    let model = await modelData.getModelById(modelID);
    if (!model._id) {
        throw `Error: model must be created before the asset for it can be created`;
    }
    let contributor = await contributorsData.getContributorById(contributorID);
    if (!contributor._id) {
        throw `Error: contributor must be created before the asset can be created`;
    }

    let assetsDB = await assets();
    let assetObj = {
        "modelID": modelID, // Which model is this for? (Eventually we can have a separate attr for compatibility??)
        "category": assetCategory,
        "label": assetLabel, // unique?
        "imageURL": assetImage,
        "imageMetadata": imageMetadata ? imageMetadata : null,
        "contributorID": contributorID,
        "approved": false,
        "rejected": false,
        "published": false,
        "color": assetExtra.color ? assetExtra.color : null,
        "brand": assetExtra.brand ? assetExtra.brand : null,
        "briefDescription": assetExtra.briefDescription ? assetExtra.briefDescription : null, // Mostly for use in alt text for images
        "icon": assetExtra.icon ? assetExtra.icon : null, // Either scale down assetImage or ask users to submit a 50x50 file
        "artStyle": assetExtra.artStyle ? assetExtra.artStyle : null,
        "owner": false, // are you the owner of this image
        "uploadDate": new Date(), // Holycoders.com says the BSON date format is best way to store so I will listen
        "approveDate": null,
        "rejectDate": null,
        "decidedBy": null
    };

    // TODO: check file dimensions etc?
    // also define the info associated with extras and add checks for those\
    // validate(assetCategory, assetExtra)

    let assetInserted = await assetsDB.insertOne(assetObj);
    if (!assetInserted.insertedId) {
        throw `Error: could not insert asset`;
    }
    return assetInserted.insertedId.toString();
}

async function approveAsset(assetId) {
    let assetsDB = await assets();
    assetId = assetId.trim();
    assetId = validate.validateId(assetId);

    let assetApproved = {
        "approved": true
    };

    let updatedObj = await assetsDB.updateOne({'_id': assetId}, { $set: assetApproved });
    if (updatedObj['modifiedCount'] !== 1)
        throw `Could not find asset with id: ${assetId}`;

    return;
}

async function rejectAsset(assetId) {
    let assetsDB = await assets();
    assetId = validate.validateId(assetId);
    
    let assetRejected = {
        "rejected": true
    };
    let updatedObj = await assetsDB.updateOne({'_id': assetId}, { $set: assetRejected });
    if (updatedObj['modifiedCount'] !== 1)
        throw `Could not find asset with id: ${assetId}`;

    return;
}   

async function updateAsset(assetId, updateObj) {
    let assetsDB = await assets();
    // Check for things that we expect to be updated
    // [category, label, briefdesc, color, brand, icon]
    for (let updateKey in updateObj) {
        let validKey = ['category', 'label', 'briefDesciption', 'color', 'brand', 'icon'].some((element) => updateKey === element);
        if (!validKey){
            throw `Invalid update object given, could not validate key ${updateKey}`;
        }
    } 

    let updatedObj = await assetsDB.updateOne({'_id': assetId}, { $set: updateObj});
    if (updatedObj['modifiedCount'] !== 1){
        throw `Could not find asset with id: ${assetId}`;
    }
    return;
}

async function getAssetByID(assetId){
    if (arguments.length !== 1){
        throw `Error: must pass assetId`;
    }
    let assetsDB = await assets();
    assetId = validate.validateId(assetId);
    
    let asset = await assetsDB.findOne({'_id': assetId});
    if (!asset) 
        throw `Error: could not find asset with id: ${assetId.toString()}`;

    return asset;
}

async function getAssetsByColor(color){
    let assetsDB = await assets();

    let foundAssets = await assetsDB.find({'color': color});
    if (!foundAssets)
        throw `Error: could not find assets with color: ${color}`;

    return foundAssets;
}

async function getAssetByUrl(url){

    let assetsDB = await assets();

    let foundAssets = await assetsDB.find({ 'imageURL': url });
    if (!foundAssets) {
        return null;
    }

    return foundAssets;
}

async function getAssetsByCategory(assetCategory){
    let assetsDB = await assets();

    let foundAssets = await assetsDB.find({'category': assetCategory});
    if (!foundAssets)
        throw `Error: could not find assets under category ${assetCategory}`;
    return foundAssets;
}

async function getAssetByFilename(assetImage) {
    let assetsDB = await assets();
    let asset = await assetsDB.findOne({'file': assetImage});
    if (!!asset) 
        throw `Could not find file ${assetImage}`;
    else
        return asset;
}

/**
 * 
 * @returns 
 */
async function getAssets() {
    let assetsDB = await assets();
    let assetObjects = await assetsDB.find({});
    return assetObjects.toArray();
}

module.exports = {
    createAsset,
    approveAsset,
    rejectAsset,
    updateAsset,
    getAssetByFilename,
    getAssetByID,
    getAssetsByCategory,
    getAssetsByColor,
    getAssetByUrl,
    getAssets
};