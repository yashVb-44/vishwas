const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        email : {
            type : String
        },
        mobileNo: {
            type: String
        },
        password: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Admin', AdminSchema);
