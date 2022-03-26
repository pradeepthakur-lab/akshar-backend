/* NODE-MODULES */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const async = require('async');
const bcrypt = require('bcryptjs');
const randomstring = require("randomstring");
const { check, validationResult, body } = require('express-validator');
// const helper = require('../lib/helper');

/* Models */
const Customer = require('../models/customer');

const customerController = {
    async getAllCustomer (req, res){
        let { status } = req.query;
        let condition ={};
        if (status) {
            condition = {
                status: status
            }
        }
        const customers = await Customer.find(condition,{__v: 0}).sort({ createdAt: -1 });
        const count = await Customer.countDocuments(condition);
        if (customers) {
            return res.status(200).json({
                error: false,
                message: "All Customers List fetched successfully!",
                count,
                data: customers,
            });
        } else {
            return res.status(422).json({
                error: true,
                message: 'Unable to fetch customers!',
                data: null
            })
        }
    },
    async getAll (req, res){
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

        const customers = await Customer.find(condition,{__v: 0}).skip(skip).limit(limit).sort({ createdAt: -1 });
        const count = await Customer.countDocuments(condition);
        if (customers) {
            return res.status(200).json({
                error: false,
                message: "Customers fetched successfully!",
                count,
                data: customers,
            });
        } else {
            return res.status(422).json({
                error: true,
                message: 'Unable to fetch customers!',
                data: null
            })
        }
    },
    async create (req, res) {
        try {
            const result = validationResult(req);
            if (result.errors.length > 0) {
                return res.status(200).json({
                    error: true,
                    message: result.errors[0].msg,
                    errors: result
                });
            }
            const checkCustomer = await Customer.findOne({email: req.body.email});
            if(checkCustomer){
                return res.status(400).json({
                    error: true,
                    message: "Email Id already exist.!",
                })
            } else{
                const customer = await Customer.create(req.body);
                if (customer) {
                    return res.status(200).json({
                        error: false,
                        message: "Customer created successfully!",
                        data: customer
                    })
                } else {
                    return res.status(422).json({
                        error: true,
                        message: "Unable to create Customer",
                        data: null
                    })
                }
            }
        }catch(err){
            res.status(500).json({
                error: true,
                message: "Somthing went wrong!"
            })
        }
    },
    async getCustomerById(req, res){
        let { page, size } = req.query;
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 10
        }
        const limit = parseInt(size);
        const skip = (page - 1) * size;

        if (!mongoose.Types.ObjectId.isValid(req.params.customerId)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid customer id',
                data: null
            })
        };
        const customerId = req.params.customerId;    
        const customers = await Customer.findOne({_id: customerId},{__v: 0}).skip(skip).limit(limit).sort({ createdAt: -1 });
        const count = await Customer.countDocuments({_id: customerId});
        if (customers) {
            return res.status(200).json({
                error: false,
                message: "Customers fetched successfully!",
                count,
                data: customers,
            });
        } else {
            return res.status(422).json({
                error: true,
                message: 'Unable to fetch customers!',
                data: null
            })
        }
    },
    async update(req, res){
        const result = validationResult(req);
            if (result.errors.length > 0) {
                return res.status(200).json({
                    error: true,
                    message: result.errors[0].msg,
                    errors: result
                });
            }
        if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid customer id',
                data: null
            })
        };

        const customer = await Customer.findByIdAndUpdate(req.body._id, req.body,{new: true});
        // console.log(customer);
        if (!customer) {
            return res.status(200).json({
                error: true,
                message: `No Customer with that id of ${req.body._id} !`,
                data: null,
            });
        }
        return res.status(200).json({
            error: false,
            message: "customer updated successfully!",
            data: customer,
        });
    },
    async deleteCustomer (req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.customerId)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid customer id',
                data: null
            })
        };
        const customer = await Customer.findByIdAndDelete({_id: req.params.customerId});
        if (!customer) {
            return res.status(200).json({
                error: true,
                message: `Cannot deleted Customer with id=${req.params.customerId}. Maybe Customer was not found!`
            });
        }
        return res.status(200).json({
            error: false,
            message: "customer deleted successfully!"
        });
    }
    
};

module.exports = customerController;