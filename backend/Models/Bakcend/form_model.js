const mongoose = require('mongoose');

const FormSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        type: {
            type: String,
            default: "1"
        },
        name: {
            type: String,
        },
        images: [{
            type: String
        }],
        age: {
            type: Number,
        },
        address: {
            type: String
        },
        state: {
            type: String
        },
        city: {
            type: String
        },
        mobileNo: {
            type: Number
        },
        details: {
            type: String
        },
        contactDetails: {
            type: String
        },
        extraDetails: {
            type: String
        },
        date: {
            type: Date
        },
        status: {
            type: String,
            default: "0"
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Forms', FormSchema);
