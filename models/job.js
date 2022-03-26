var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var inwardSchema = new Schema({
        FireWire: {
            type: String,
            required: false,
        },
        USB: {
            type: String,
            required: false,
        },
        Camera: {
            type: String,
            required: false,
        },
        Speaker: {
            type: String,
            required: false,
        },
        Trackpad: {
            type: String,
            required: false,
        },
        OpticalDrive: {
            type: String,
            required: false,
        },
        Ethernet: {
            type: String,
            required: false,
        },
        Display: {
            type: String,
            required: false
        },
        HardDrive: {
            type: String,
            required: false
        },
        Airport: {
            type: String,
            required: false,
        },
        RAM: {
            type: String,
            required: false,
        },
        Keyboard: {
            type: String,
            required: false,
        },
        Battery: {
            type: String,
            required: false,
        },
        Bluetooth: {
            type: String,
            required: false
        },
        Adaptar: {
            type: String,
            required: false,
        }
});


var partSchema = new Schema({
    partName: {
        type: String,
        required: false,
    },
    partDesc: {
        type: String,
        required: false,
    },
    partQty: {
        type: Number,
        required: false,
    },
    partAmount: {
        type: Number,
        required: false,
    },
    partGSTAmount: {
        type: Number,
        required: false,
    },
    isApprove: {
        type: Number,
        default: 0,
        enum: [0, 1]
    }
});

var schema = new Schema(
    {
        customer_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'customer'
        },
        user_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user'
        },
        brandName: {
            type: String,
            required: true,
        },
        productType: {
            type: String,
            required: true,
        },
        modelNumber: {
            type: String,
            required: true,
        },
        serialNumber: {
            type: String,
            required: true,
        },
        problems: {
            type: String,
            required: false
        },
        dataBackup: {
            type: String,
            required: false
        },
        productCondition: {
            type: String,
            required: false
        },
        inwardDate: {
            type: Date,
            required: false
        },
        assignee: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user'
        },
        quotation: {
            type: String,
            required: false
        },
        accesoriesReceived: {   // Accessories Details
            type: Array,
            required: false,
        },
        imageOne: {
            type: String,
            default: "",
            required: false
        },
        imageTwo: {
            type: String,
            default: "",
            required: false
        },
        imageThree: {
            type: String,
            default: "",
            required: false
        },
        imageFour: {
            type: String,
            default: "",
            required: false
        },
        inward: inwardSchema,   // for Single subdocument // Parts Status
        parts: [partSchema],    // for Array of subdocuments    // purchased parts
        diganoseDetails: {
            type: String,
            required: false
        },
        outwardDate: {
            type: Date,
            required: false
        },
        jobStatus: {
            type: Number,
            default: 0,
            enum: [0, 1]
        },
        jobDoneDate: {
            type: Date,
            required: false
        },
        jobNotApprove: {
            type: Number,
            default: 0,
            enum: [0, 1]
        },
        jobAmount: {
            type: String,
            required: false
        },
        billNo: {
            type: String,
            required: false
        },
        paidAmount: {
            type: String,
            required: false
        },
        paidType: {
            type: String,
            required: false
        },
        paidDate: {
            type: Date,
            required: false
        },
        serviceTax: {
            type: Number,
            default: 0,
            enum: [0, 1]
        },
        sendInvoice: {
            type: Number,
            default: 0,
            enum: [0, 1]
        },
        engineerRemark: {
            type: String,
            required: false
        },
        isDeliver: {
            type: Number,
            default: 0,
            enum: [0, 1]
        },
        deliverDate: {
            type: Date,
            required: false
        },
        dateAdded: {
            type: Date,
            required: false
        },
        dateModified: {
            type: Date,
            required: false
        },
        branch: {
            type: String,
            required: false
        },
        jobWorkStatus: {
            type: String,
            default: "work in progress",
            required: false
        },
        status:{
            type: Number,
            default: 1,
            enum: [0, 1]        // 0 for inhouse and 1 for deliverd
        }
    },
    {
        timestamps: true
    });

const Job = mongoose.model("job", schema);
module.exports = Job;