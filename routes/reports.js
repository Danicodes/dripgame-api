const express = require('express');
const router = express.Router();

const reportsData = require('../data/reports');

router.route('/')
.get(async(req, res) => {
    // Get all reports
    let reports = await reportsData.getAllReports();
})

.post(async(req, res) => {
    // Create new report
    // req.body....
    await reportsData.createReport()
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
})

router.route('/')

module.exports = router;