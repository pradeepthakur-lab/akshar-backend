/* NODE-MODULES */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const async = require('async');
const bcrypt = require('bcryptjs');
const randomstring = require("randomstring");
const { check, validationResult, body } = require('express-validator');
// const helper = require('../lib/helper');

/* Models */
const Job = require('../models/job');
const Customer = require('../models/customer');

const customerController = {
    async getJobsCount (req, res){
        try {
            const jobCount = await Job.countDocuments({"status": 1});
            const jobDone = await Job.countDocuments({"status": 1, "jobStatus": 1});
            const jobPending = await Job.countDocuments({"status": 1, "jobStatus": 0});
            const jobNotApprove = await Job.countDocuments({"status": 1, "jobNotApprove": 1});
            const totalCustomer = await Customer.countDocuments();
            const activeCustomer = await Customer.countDocuments({"status": 1});
                const data =[];
                data.push({"totalJobs" : jobCount},{"jobsDone" : jobDone},{"pendingJobs" : jobPending});
                data.push({"notApproveJobs" : jobNotApprove},{"totalCustomer" : totalCustomer},{"activeCustomer" : activeCustomer});
            return res.status(200).json({
                error: false,
                message: "Data found successfully!",
                data: data
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: "Somthing went wrong!"
            })
        }
    }
    
};

module.exports = customerController;