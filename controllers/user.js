/* NODE-MODULES */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const async = require('async');
const bcrypt = require('bcryptjs');
const randomstring = require("randomstring");
const { check, validationResult, body } = require('express-validator');
// const helper = require('../lib/helper');

/* Models */
const User = require('../models/user');

const userController = {
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
        const users = await User.find(condition,{__v: 0, password: 0}).skip(skip).limit(limit).sort({ createdAt: -1 });
        const count = await User.countDocuments(condition);
        if (users) {
            return res.status(200).json({
                error: false,
                message: "Users fetched successfully!",
                count,
                data: users,
            });
        } else {
            return res.status(422).json({
                error: true,
                message: 'Unable to fetch Users!',
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
            inputJson = req.body;
            const checkUser = await User.findOne({email: inputJson.email});
            if (checkUser) {
                return res.status(400).json({
                    error: true,
                    message: "Email Id already exist.!",
                })
            } else {
                if(!inputJson.password){
                    let pass =bcrypt.hashSync("12345678", bcrypt.genSaltSync(10));
                    console.log('password', pass)
                    inputJson["password"] = pass;
                } else{
                    inputJson.password = bcrypt.hashSync(inputJson.password, bcrypt.genSaltSync(10));
                }
                const isUserCreated = await User.create(inputJson)
                const { password, ...userData } = isUserCreated._doc;
                if (isUserCreated) {
                    return res.status(200).json({
                        error: false,
                        message: "User has been created successfully!",
                        data: userData
                    })
                } else {
                    return res.status(400).json({
                        error: true,
                        message: "Unable to create this user!",
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
    async getUserById(req, res){
        let { page, size } = req.query;
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 10
        }
        const limit = parseInt(size);
        const skip = (page - 1) * size;

        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid user id',
                data: null
            })
        };
        const userId = req.params.userId;    
        const users = await User.findOne({_id: userId},{__v: 0}).skip(skip).limit(limit).sort({ createdAt: -1 });
        const count = await User.countDocuments({_id: userId});    
        const { password, ...userData } = users._doc;
        if (users) {
            return res.status(200).json({
                error: false,
                message: "Users fetched successfully!",
                count,
                data: userData,
            });
        } else {
            return res.status(400).json({
                error: true,
                message: 'Unable to fetch Users!',
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
                message: 'Invalid user id',
                data: null
            })
        };

        inputJson = req.body;

        if(inputJson.password){
            inputJson.password = bcrypt.hashSync(inputJson.password, bcrypt.genSaltSync(10));
        } 
        const user = await User.findByIdAndUpdate(req.body._id, inputJson,{new: true});
        const { password, ...userData } = user._doc;
        // console.log(user);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: `No user with that id of ${req.body._id} !`,
                data: null,
            });
        }
        return res.status(200).json({
            error: false,
            message: "user updated successfully!",
            data: userData,
        });
    },
    async deleteUser (req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid user id',
                data: null
            })
        };
        const user = await User.findByIdAndDelete({_id: req.params.userId});
        if (!user) {
            return res.status(404).json({
                error: true,
                message: `Cannot deleted user with id=${req.params.userId}. Maybe user was not found!`
            });
        }
        return res.status(200).json({
            error: false,
            message: "user deleted successfully!"
        });
    }
    
};

module.exports = userController;