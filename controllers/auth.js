/* NODE-MODULES */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const async = require('async');
const bcrypt = require('bcryptjs');
const randomstring = require("randomstring");
const { check, validationResult, body } = require('express-validator');
const jwt = require('jsonwebtoken'); //to generate signed token
// const helper = require('../lib/helper');

/* Models */
const User = require('../models/user');

const authController = {
    async login (req, res) {
        try {
            const result = validationResult(req);
            if (result.errors.length > 0) {
                return res.status(200).json({
                    error: true,
                    message: result.errors[0].msg,
                    errors: result
                });
            }
            
            const user = await User.findOne({ email: req.body.email });
            if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(403).json({
                    error: true,
                    message: "Invalid email or password!",
                    data: null
                })
            } else {
                const accessToken = jwt.sign({
                    id: user._id,
                    role: user.role
                }, process.env.JWT_SECRET, { expiresIn: "3d" });

                const { password, ...userData } = user._doc; // We have deleted `password` KEY from `user` object & saved other data to new `userData` object and passed it
                res.status(200).json({
                    error: false,
                    message: "User Logged in successfully!",
                    token: accessToken,
                    data: userData
                })
            }
        }catch(err){
            res.status(500).json({
                error: true,
                message: "Somthing went wrong!"
            })
        }
        
    },
    async register (req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(403).json({
                    error: true,
                    message: "This email already exist!",
                    data: null
                })
            } else {
                req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
                const isUserCreated = await User.create(req.body)
                const { password, ...userData } = isUserCreated._doc; // We have deleted `password` KEY from `user` object & saved other data to new `userData` object and passed it
                if (isUserCreated) {
                    return res.status(200).json({
                        error: false,
                        message: "User has been regsiterd successfully!",
                        data: userData
                    })
                } else {
                    return res.status(422).json({
                        error: true,
                        message: "Unable to register this user!",
                        data: null
                    })
                }
            }
        } catch(err){
            res.status(500).json({
                error: true,
                message: "Somthing went wrong!"
            })
        }
        
    },
    logout (req, res) {
        res.clearCookie('t');
        return res.status(200).json({
            error: false,
            message: "Logged Out Successfully"
        })
    },
    
};

module.exports = authController;