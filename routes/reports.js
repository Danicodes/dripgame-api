const express = require('express');
const router = express.Router();

const reportsData = require('../data/reports');
const assetsData = require('../data/assets');
const contributorData = require('../data/contributors');

router.route('/')
.get(async(req, res) => {
    // Get all reports
    console.log("Getting all the reports");
    let reports;
    try {
        reports = await reportsData.getAllReports();
    } catch(e){
        res.status(500).send(`Error: ${e}`);
        return
    }
    if (reports)
        res.status(200).send(reports)
})

.post(async(req, res) => {
    // Create new report
    // req.body....
    let {reportingUser, reportedImageURL, reportReason, ownerChallenge} = req.body;
    let reportedUser; 
    let assetId;
    try {
        let reportedAsset = await assetsData.getAssetByUrl(reportedImageURL);
        reportedUser = reportedAsset[0].contributorID;
        assetId = reportedAsset[0]._id;
    } 
    catch (e){
        res.status(400).send({error: e});
        return;
    }

    try {
        let createdAssetId = await reportsData.createReport(
            reportingUser,
            reportedUser,
            assetId,
            reportReason,
            ownerChallenge
        )
        res.send({data: createdAssetId})
    } catch (e) {
        res.status(500).send({error: `Bad! ${e}`});
    }
})
;

router.route('/user')
.get(async(req, res) => {
    if (req.query.reportedUser) {
        await reportsData.getReportsOfUser();
    }
    else if (req.query.reportingUser) {
        await reportsData.getReportsByUser();
    }
});


module.exports = router;