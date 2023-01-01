const mongoCollections = require('../config/mongoCollections');
const assets = mongoCollections.assets;
const contributors = mongoCollections.contributors;
const validate = require('./validations'); //-- create some validation checks somehow

const { ObjectId } = require('mongodb');
// TO DO convert all object ids being returned in objects to strings

/**
 * 
 * @param {string} username : Twitch username, requires oauth
 * @param {string | null} instagram: instagram  
 * @param {string| null} twitter: link to your twitter  
 * @param {string: null} website: External website to link to 
 */
async function createContributor(username, instagram = null, twitter = null, website = null) {
    // Oauth with twitch
    let contributorDB = await contributors();
    
    let userExists = await contributorDB.findOne({'twitchUsername': username});
    if (userExists && Object.keys(userExists).length > 0) {
        throw `Error: user already in database with twitch username: ${username}`;
    }
    
    // User could not be found, create them
    let userObj = {
        'twitchUsername': username,
        'instagramUsername': instagram,
        'twitterUsername': twitter,
        'website': website
    }    

    let insertedContributor = await contributorDB.insertOne(userObj);
    if (!insertedContributor.insertedId) {
        throw `Error: could not insert contributor`
    }
    return insertedContributor.insertedId.toString();
}

async function getContributors() {
    let contributorDB = await contributors();
    
    let contributorList = await contributorDB.find({}, {'_id': 0}).toArray();
    console.log(contributorList);
    return contributorList; // list of distinct contributors
}

async function getContributorFiles(contributor){
    let assetsDB = await assets();
    let files = await assetsDB.find({'contributor': contributor}, {'file': 1});
    return files; // list of files
}

async function getContributorByUsername(twitchUsername){
    let contributorDB = await contributors();
    let contributor = await contributorDB.findOne({'twitchUsername': twitchUsername});

    if (!contributor) {
        throw `Error: could not find user with twitch username: ${twitchUsername}, `;
    }
    else {
        return contributor;
    }
}

async function getContributorById(contributorId){
    let contributorDB = await contributors();
    contributorId = ObjectId(contributorId);

    let contributor = await contributorDB.findOne({'_id': contributorId});

    if (!contributor) {
        throw `Error: could not find user with id: ${contributorId}`;
    }
    else {
        return contributor;
    }
}

module.exports = {
    getContributors,
    getContributorFiles,
    createContributor,
    getContributorByUsername,
    getContributorById
}