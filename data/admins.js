const mongoCollections = require('../config/mongoCollections');
const admins = mongoCollections.admins;
const reports = require('./reports');
const assets = require('./assets');

async function checkUserIsAdmin(username){
    const adminsDB = await admins();
    let foundAdmin = await adminsDB.find({'twitchUsername': username}).toArray();
    return foundAdmin.length == 1;
}

async function createAdmin(username){
    const adminsDB = await admins();
    let foundAdmin = await adminsDB.find({'twitchUsername': username}).toArray();
    if (foundAdmin.length > 0){
        throw new Error(`AAAAAAAAAAHHHHHH`);
    }

    let newAdmin = {
        'twitchUsername': username,
        'resolvedReports': [], // a list of report ids that the admin has made a decision on
        'addedSubmissions': [], // list of image ids that the admin has made a decision on
    }

    let createdAdmin = await adminsDB.insertOne(newAdmin);
    if (!createdAdmin.insertedId) {
        throw new Error(`Admin couldn't be added to the database womp`);
    }
    return createdAdmin.insertedId;
}

async function getAdmin(username){
    const adminsDB = await admins(); 
    let foundAdmin = await adminsDB.find({'twitchUsername': username}).toArray();
    if (foundAdmin.length > 1){
        throw new Error(`AAAAAAAAAAHHHHHH`);
    }
    
    return foundAdmin[0]
}

async function getAllAdmins(){
    const adminsDB = await admins();
    let foundAdmins = await adminsDB.find({}).project({'_id': 0}).toArray();
    return foundAdmins;
}

async function deleteAdmin(username){
    const adminsDB = await admins();
    let foundAdmin = await adminsDB.find({'twitchUsername': username}).toArray();
    if (foundAdmin.length > 1){
        throw new Error(`AAAAAAAAAAHHHHHH`);
    }
    
    foundAdmin = foundAdmin[0]

    let deletedAdmin = await adminsDB.deleteOne({'_id': foundAdmin._id});
    if (deletedAdmin.deletedCount != 1){
        throw new Error(`Could not delete ${username} from admin collection`);
    }

    return deleteAdmin.acknowledged;
}

async function addReportResolution(username, reportId){
    const adminsDB =  await admins();
    let foundAdmin = await getAdmin(username);

    let report = await reports.getReportById(reportId);
    if (!report){
        throw new Error(`Cannot find report to add to admins list`);
    }

    let updatedAdmin = await adminsDB.updateOne({'_id': foundAdmin._id}, 
        {'$push': {'resolvedReports': reportId }});
    
    if (updatedAdmin.modifiedCount != 1){
        throw new Error(`Could not modify admins reports`);
    }

    return updatedAdmin.acknowledged;
}

async function addSubmissionResolution(username, submissionId){
    const adminsDB =  await admins();
    let foundAdmin = await getAdmin(username);

    let submission = await assets.getAssetByID(submissionId);
    if (!submission){
        throw new Error(`Cannot find submission to add to admin's list`);
    }

    let updatedAdmin = await adminsDB.updateOne({'_id': foundAdmin._id}, 
        {'$push': {'resolvedReports': submissionId }});
    
    if (updatedAdmin.modifiedCount != 1){
        throw new Error(`Could not modify admins reports`);
    }

    return updatedAdmin.acknowledged;
}
module.exports = {
    checkUserIsAdmin,
    createAdmin,
    getAdmin,
    deleteAdmin,
    addReportResolution,
    addSubmissionResolution,
    getAllAdmins
}
