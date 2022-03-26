var jwt = require('jsonwebtoken');
let userModel = require('../models/user');

const authenticateUser = async (req, res, next) => {
    // console.log('req.headers ==>',req.headers);
    // const token = req.headers.token ? req.headers.token : req.query.token; 
    // const decoded = jwt.decode(token, "ak");
    try {
        const token = req.headers.authorization;
        const decoded = jwt.decode(token.split(" ")[1]);
        console.log("decoded authenticateUser", token)
        return userModel.findOne({
            '_id': decoded.id
        }).then((userData) => {
            console.log('userData',userData)
            if (!userData || userData == undefined) {
                return res.status(200).json({
                    message: 'user not found',
                    error: true,
                });
            }
            if (userData.status == 'blocked') {
                return res.status(200).json({
                    message: 'You are blocked by admin',
                    error: true,
                });
            }
            if (userData.status == 'inactive') {
                return res.status(200).json({
                    // message: 'OTP verification is pending',
                    message: 'User has inactive',
                    error: true,
                });
            }
            req.user = userData;
            return next(null, userData);
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Authorization required.',
            error: true,
        });
    }
}

const verifyToken = (req, res, next) => {
    // let token = req.headers["x-access-token"];
    // const token = req.headers.token ? req.headers.token : req.query.token;
    try{
        const tokenHeader = req.headers.authorization;
        let token = tokenHeader.replace(/^Bearer\s/, '');
        if (!token) {
            return res.status(403).json({
                message: 'Authorization required.',
                error: true,
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Unauthorized!',
                    error: true,
                });
            }
            req.loggedUserId = decoded.id;
            req.loggedUserRole = decoded.role;
            next();
        });
    } catch(err){
        return res.status(500).json({
            message: 'internel server error!',
            error: true,
        });
    }    
}

module.exports = {
    authenticateUser,
    verifyToken
}