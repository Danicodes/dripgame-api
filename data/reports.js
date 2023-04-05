const mongoCollections = require('../config/mongoCollections');
const assets = mongoCollections.assets;
const contributors = mongoCollections.contributors;
const reports = mongoCollections.reports;
const validate = require('./validations'); //-- create some validation checks somehow

const { ObjectId } = require('mongodb');

/**
 * 
 * @param {string} reportingUser
 * @param {string} reportedUser 
 * @param {string} reportedImageURL 
 * @param {string} reportReason 
 * @param {boolean} ownerChallenge 
 */
async function createReport(reportingUser, reportedUser, reportedImageURL, reportReason, ownerChallenge) {
    const reportsDB = await reports();
    const report = {
        'reportingUser': reportingUser,
        'reportedUser': reportedUser,
        'assetId': null,
        'reason': reportReason,
        'ownershipChallenged': ownerChallenge,
        'status': "AWAITING REVIEW", // enum : awaiting/pending, viewed, decided
        'verdict': {
            'admin': null,
            'decision': null // pending, accepted (meaning this post should be removed), rejected (meaning nothing found wrong with the post)
        }
    }


    // Twitch utility
}

async function getReportsByUser(userId){
    const reportsDb = await reports();
    
    let reports = await reportsDb.findAll({'reportingUser': userId});
    if (!reports) {
        return [];
    } 
    return reports;
}

async function getReportsOfUser(userId){
    const reportsDb = await reports();
    
    let reports = await reportsDb.findAll({'reportedUser': userId});
    if (!reports) {
        return [];
    } 
    return reports;

}

async function getAllReports(){
    const reportsDb = await reports();
    let reports = await reportsDb.findAll();
    return reports;
}

module.exports = {
    createReport,
    getAllReports,
    getReportsByUser,
    getReportsOfUser,
}