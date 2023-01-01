const mongoCollections = require('../config/mongoCollections');
const models = mongoCollections.models;
const validate = require('./validations');

/**
 * All of the models in our db
 */
async function createModel(twitchUsername) {
    let modelsDB = await models();
    // TODO: Check that the username corresponds to a valid twitch** user?

    let modelObj = {
        'username': twitchUsername,
    };
    let modelExists = await modelsDB.findOne({'username': twitchUsername});
    if (modelExists && Object.keys(modelExists).length != 0) {
        throw `Error: Model already in database`; // new Error: ObjectAlreadyExists Error/Exception
    }

    let modelInserted = await modelsDB.insertOne(modelObj); 
    if (!modelInserted.insertedId) {
        throw `Error: Could not insert object for ${twitchUsername}`; // new Error InsertError?
    }

    return modelInserted.insertedId.toString();
}

async function getAllModels(){
    let modelsDB = await models();

    let foundModels = await modelsDB.find({}).toArray();
    if (!foundModels)
        return [];

    return foundModels;
}

async function getModelById(modelId){
    //Error checking, will throw if id is invalid
    modelId = validate.validateId(modelId);

    let modelsDB = await models();

    let foundModel = await modelsDB.findOne({'_id': modelId});
    if (!foundModel) {
        return null;
    }

    return foundModel;
}

async function getModelByUsername(modelUsername){
    let modelsDB = await models();
    
    let foundModel = await modelsDB.findOne({'username': modelUsername});
    if (!foundModel) {
        return null;
    }

    return foundModel;
}

module.exports = {
    getAllModels,
    getModelById,
    getModelByUsername,
    createModel,
}

// If someone uploads a new model not in the db then create new model