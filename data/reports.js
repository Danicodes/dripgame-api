const mongoCollections = require('../config/mongoCollections');
const assets = mongoCollections.assets;
const contributors = require('./contributors');
const reports = mongoCollections.reports;
const validate = require('./validations'); //-- create some validation checks somehow

const { ObjectId } = require('mongodb');

/**
 * 
 * @param {string} reportingUser
 * @param {string} reportedUser 
 * @param {string} assetId
 * @param {string} reportReason 
 * @param {boolean} ownerChallenge 
 */
async function createReport(reportingUser, reportedUser, assetId, reportReason, ownerChallenge) {
    const reportsDB = await reports();
    const reportingUserObj = contributors.getContributorByUsername(reportingUser);
    // TODO: If there's not a contributor, insert them -- need to keep record of folks reporting as well
    const reportingUserId = validate.validateId(reportingUserObj._id);
    const reportedUserId = validate.validateId(reportedUser);
   
    assetId = validate.validateId(assetId);
    
    // Users can't report themselves
    
    const report = {
        'reportingUser': reportingUserId,
        'reportedUser': reportedUserId,
        'assetId': assetId,
        'reason': reportReason,
        'ownershipChallenged': ownerChallenge,
        'status': "AWAITING REVIEW", // enum : awaiting/pending, viewed, decided
        'verdict': {
            'admin': null,
            'decision': null // pending, accepted (meaning this post should be removed), rejected (meaning nothing found wrong with the post)
        }
    }

    let reportCreated = await reportsDB.insertOne(report);
    if (!reportCreated.insertedId) {
        throw `Error: Could not insert data for report`; // new Error InsertError?
    }

    return reportCreated.insertedId.toString();


    // Twitch utility
}

async function getReportsByUser(userId){
    const reportsDb = await reports();
    
    let reportsData = await reportsDb.findAll({'reportingUser': userId});
    if (!reportsData) {
        return [];
    } 
    return reportsData;
}

async function getReportsOfUser(userId){
    const reportsDb = await reports();
    
    let reportsData = await reportsDb.findAll({'reportedUser': userId});
    if (!reportsData) {
        return [];
    } 
    return reportsData;

}

async function getAllReports(){
    const reportsDB = await reports();
    let reportsData = await reportsDB.find({}).toArray();
    if (!reportsData){
        return [];
    }
    return reportsData;
}

async function getReportById(reportId){
    const reportsDB = await reports();
    reportId = validate.validateId(reportId);
    let reportsData = await reportsDB.find({'_id': reportId}).toArray();
    if (reportsData.length < 1){
        return null;
    }
    else if (reportsData.length > 1){
        throw new Error(`Found multiple reports with the same id`);
    }

    return reportsData[0]
}

module.exports = {
    createReport,
    getAllReports,
    getReportsByUser,
    getReportsOfUser,
    getReportById
}