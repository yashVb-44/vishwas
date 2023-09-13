const express = require('express');
const route = express.Router();
const Wishlist = require('../../Models/Frontend/wishlist_model');
const User = require('../../Models/Frontend/user_model')
const authMiddleWare = require('../../Models/Frontend/wishlist_model')

// Add and Remove product to wishlist
route.post('/addremove', authMiddleWare, async (req, res) => {
    const userId = req.user.userId;
    const { formId } = req.body;

    try {
        const existingWishlistItem = await Wishlist.findOne({ user: userId, form: formId });

        if (existingWishlistItem) {
            await Wishlist.findByIdAndDelete(existingWishlistItem._id);
            res.status(200).json({ type: 'success', message: 'Post removed from wishlist successfully' });
        } else {
            const wishlistItem = new Wishlist({
                user: userId,
                form: formId,
            });

            await wishlistItem.save();
            res.status(200).json({ type: 'success', message: 'Post added to wishlist successfully' });
        }
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
    }
});

// Remove product from wishlist
route.delete('/remove/:id', authMiddleWare, async (req, res) => {
    const userId = req?.user?.userId
    const formId = req?.params?.id;

    try {
        await Wishlist.findOneAndDelete({ user: userId, form: formId });
        res.status(200).json({ type: 'success', message: 'Post removed from wishlist successfully' });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
        console.log(error)
    }
});

// // Get user's wishlist
// route.get('/get', authMiddleWare, async (req, res) => {
//     const userId = req.user?.userId;

//     try {

//         const user = await User.findOne({ _id: userId });

//         const wishlistItems = await Wishlist.find({ user: userId })
//             .populate('form')
//             .sort({ createdAt: -1 });

//         // Extract the product details from the wishlist items
//         let wishlistProducts = wishlistItems.map(item => ({
//             // _id: item?._id,
//             _id: item?.form._id,
//             name: item?.form.name,
//             image: `http://${process.env.IP_ADDRESS}:${process.env.PORT}/${item?.form?.image?.path?.replace(/\\/g, '/')}`,
//             Product_Dis_Price: (user?.User_Type === '0' || userId === "0"
//                 ? (item?.product?.Product_Dis_Price)
//                 : (user?.User_Type === '1' ? item?.product?.Gold_Price :
//                     (user?.User_Type === '2' ? item?.product?.Silver_Price : item?.product?.PPO_Price))),

//             Product_Ori_Price: (user?.User_Type === '0' || userId === "0"
//                 ? (item?.product?.Product_Ori_Price) : (item?.product?.Product_Dis_Price)),
//             isFavorite: true
//         }));

//         res.status(200).json({ type: 'success', message: 'User wishlist fetched successfully', wishlist: wishlistProducts });
//     } catch (error) {
//         res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
//         console.log(error)
//     }
// });

// Delete users Wish List  
route.delete('/delete', authMiddleWare, async (req, res) => {
    const userId = req.user.userId;

    try {
        const existingWishlistItems = await Wishlist.find({ user: userId });

        if (existingWishlistItems.length === 0) {
            return res.status(200).json({ type: 'warning', message: 'No wishlist items found for the user' });
        }

        await Wishlist.deleteMany({ user: userId });
        res.status(200).json({ type: 'success', message: 'User wishlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
    }
});

// Delete all Wish List
route.delete('/delete/all', async (req, res) => {
    try {
        await Wishlist.deleteMany();
        res.status(200).json({ type: 'success', message: 'All wishlists deleted successfully' });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
    }
});




module.exports = route