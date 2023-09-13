const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Forms',
    },
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Wishlist', wishlistSchema);


