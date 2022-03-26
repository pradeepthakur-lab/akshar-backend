var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

function toLower (string) {
    return string.toLowerCase();
}

function toCapitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 32,
            set: toLower,
            get: toCapitalize
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        mobile: {
            type: Number,
            required: true,
            trim: true,
        },
        email_verify_at: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        remember_token: {
            type: String,
            required: false
        },
        branch: {
            type: String,
            required: false
        },
        role: {
            type: String,
            enum: ['admin', 'employee']
        },
        status: {
            type: Number,
            default: 1,
            enum: [0, 1]
        },
        // status:{
        //     type: Boolean,
        //     default: true
        // }
    },
    {
        timestamps: true
    });

const User = mongoose.model("user", schema);
module.exports = User;


// module.exports.getUser = async (cb) => {
//     let data = await User.find({}).then(result => result)
//     return data
// }

// module.exports.getUserById = async (req, cb) => {
//     let data = await User.findOne({ _id: req.body.post_id })
//     return data
// }