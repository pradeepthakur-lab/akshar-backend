var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: false,
        },
        mobile: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        address: {
            type: String,
            required: false,
        },
        status: {
            type: Number,
            default: 1,
            enum: [0, 1]
        }
    },
    {
        timestamps: true
    });

const Customer = mongoose.model("customer", schema);
module.exports = Customer;