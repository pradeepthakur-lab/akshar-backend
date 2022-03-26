/* NODE-MODULES */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const async = require('async');
const bcrypt = require('bcryptjs');
const randomstring = require("randomstring");
const { check, validationResult, body } = require('express-validator');
// const helper = require('../lib/helper');
const http = require('http');
const fs =require('fs');

/* Models */
const Job = require('../models/job');

const jobController = {
    async getAll (req, res) {
        let { page, size, status } = req.query;
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 10
        }
        const limit = parseInt(size);
        const skip = (page - 1) * size;

        let condition ={};
        if (status) {
            condition = {
                status: status
            }
        }

        const jobs = await Job.find(condition,{__v: 0}).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('customer_id', { 'name': 1});
        const count = await Job.countDocuments(condition);
        if (jobs) {
            return res.status(200).json({
                error: false,
                message: "All Jobs fetched successfully!",
                count,
                data: jobs,
            });
        } else {
            return res.status(422).json({
                error: true,
                message: 'Unable to fetch Jobs!',
                data: null
            })
        }
    },
    async create (req, res) {
        try {
            // const result = validationResult(req);
            // if (result.errors.length > 0) {
            //     return res.status(200).json({
            //         error: true,
            //         message: result.errors[0].msg,
            //         errors: result
            //     });
            // }
            const job = await Job.create(req.body);
            if (job) {
                return res.status(200).json({
                    error: false,
                    message: "Inward Job created successfully!",
                    data: job
                })
            } else {
                return res.status(422).json({
                    error: true,
                    message: "Unable to create Inward Job",
                    data: null
                })
            }
            
        } catch (error) {
            console.log('error',error)
            res.status(500).json({
                error: true,
                message: "Somthing went wrong!"
            })
        }
    },
    async getJobById (req, res){
        let { page, size } = req.query;
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 10
        }
        const limit = parseInt(size);
        const skip = (page - 1) * size;

        if (!mongoose.Types.ObjectId.isValid(req.params.jobId)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid job id',
                data: null
            })
        };
        const jobId = req.params.jobId;    
        const jobs = await Job.findOne({_id: jobId},{__v: 0}).skip(skip).limit(limit).sort({ createdAt: -1 })
                                .populate('customer_id', { 'name': 1})
                                .populate('user_id', { 'name': 1})
                                .populate('assignee', { 'name': 1});
        const count = await Job.countDocuments({_id: jobId});
        if (jobs) {
            return res.status(200).json({
                error: false,
                message: "jobs fetched successfully!",
                count,
                data: jobs,
            });
        } else {
            return res.status(422).json({
                error: true,
                message: 'Unable to fetch jobs!',
                data: null
            })
        }
    },
    async update (req, res){
        // const result = validationResult(req);
        //     if (result.errors.length > 0) {
        //         return res.status(200).json({
        //             error: true,
        //             message: result.errors[0].msg,
        //             errors: result
        //         });
        //     }
        if (!mongoose.Types.ObjectId.isValid(req.body.job_id)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid job id',
                data: null
            })
        };
        const job = await Job.findByIdAndUpdate(req.body.job_id, req.body,{new: true});
        if (!job) {
            return res.status(200).json({
                error: true,
                message: `No Job with that id of ${req.body.job_id} !`,
                data: null,
            });
        }
        return res.status(200).json({
            error: false,
            message: "customer job successfully!",
            data: job,
        });
    },
    async jobPaymentById(req, res){
        if (!mongoose.Types.ObjectId.isValid(req.body.job_id)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid job id',
                data: null
            })
        };
        const job = await Job.findByIdAndUpdate(req.body.job_id, req.body,{new: true});
        if (!job) {
            return res.status(200).json({
                error: true,
                message: `No Job with that id of ${req.body.job_id} !`,
                data: null,
            });
        }
        return res.status(200).json({
            error: false,
            message: "customer job successfully!",
            data: job,
        });
    },
    video(req, res){
        const range =req.headers.range;
        if(!range){
            res.status(400).send("require range headers");
        }
        const videoPath ="bigbuck.mp4";
        const videoSize =fs.statSync("bigbuck.mp4").size;

        //parse Range
        const chunkSize =10 ** 6; // 1Mb
        const start =Number(range.replace(/\D/g, ""));
        const end =Math.min(start + chunkSize, videoSize - 1);
        const contentSize = end - start + 1;
        const headers ={
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Lenght": contentSize,
            "Content-Type": "video/mp4",
        }

        res.writeHead(206, headers);
        const videoStream =fs.createReadStream(videoPath, {start, end});
        videoStream.pipe(res)

        // res.send(`Hello video!`);
    }
    
};

module.exports = jobController;