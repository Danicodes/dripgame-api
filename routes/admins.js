const express = require('express');
const router = express.Router();

const adminData = require('../data/admins');

router.route('/:username')
.get(async(req, res) => {
    let twitchUsername = req.params.username;
    if (!twitchUsername){
        res.status(400).send(`Need valid twitch username to search`);
        return;
    }
    try{
        const isAdmin = await adminData.checkUserIsAdmin(twitchUsername);
        res.status(200).send({data: isAdmin})
        return;
    }
    catch(e) {
        res.status(500).send(`Bad things happened :( ${e}`);
        return;
    }
})
.post(async(req, res) => {
    let twitchUsername = req.params.username;
    if (!twitchUsername) {
        res.status(400).send(`BAD REQUEST -- need username to create`);
        return;
    }
    try {
        const createdAdmin = await adminData.createAdmin(twitchUsername);
        res.status(200).send({data: createdAdmin});
        return;
    }
    catch(e){
        res.status(500).send(`:( ${e})`);
        return;
    }
})
.delete(async(req, res) => {
    let twitchUsername = req.params.username;
    if (!twitchUsername) {
        res.status(400).send(`BAD REQUEST -- need username to destroy >:(`);
        return;
    }
    try {
        const deletedAdmin = await adminData.deleteAdmin(twitchUsername);
        res.status(200).send({data: deletedAdmin});
        return;
    }
    catch(e){
        res.status(500).send(`:( ${e})`);
        return;
    }

})

router.route('/')
.get(async(req, res) => { // Get all admins
    try {
        let adminList = await adminData.getAllAdmins();
        res.status(200).send({data: adminList});
    }
    catch(e) {
        res.status(500).send({error: `:( ${e}`});
    }
})
.post(async(req, res)=> { // Track the images an admin has handled (new submissions and reported images)
    try {
        let { username, reportId, submissionId } = req.body;
        if (!reportId && !submissionId) {
            res.status(400).send("Need either report or submission id to log");
            return
        }
        else if (reportId && !submissionId) {
            // Do a thing
            let addedReport = await adminData.addReportResolution(username, reportId);
            if (addedReport){
                res.status(200).send({data: addedReport});
                return;
            }
        }
        else if (submissionId && !reportId){
            let addedSubmission = await adminData.addSubmissionResolution(username, submissionId);
            if (addedSubmission) {
                res.status(200).send({data: addedSubmission});
                return;
            }
        }
    }
    catch(e) {
       res.status(500).send({error: `Something went horribly wrong ${e}`});
       return;
    }


})


module.exports = router;