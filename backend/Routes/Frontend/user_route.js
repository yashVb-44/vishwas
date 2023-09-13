const express = require('express')
const route = express.Router()
const User = require('../../Models/Frontend/user_model')
const bcrypt = require('bcrypt')
const multer = require('multer')
const jwt = require('jsonwebtoken');
const authMiddleWare = require('../../Middleware/authMiddleware')
const adminMiddleWare = require('../../Middleware/adminMiddleware')
const fs = require('fs');
const path = require('path')

// Secret key for JWT
const secretKey = process.env.JWT_TOKEN;

// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageUploads/frontend/users')
    },
    filename: function (req, file, cb) {
        cb(null, file?.originalname)
    }
})
const upload = multer({ storage: storage })


// Sign Up Route
route.post('/signup', upload.single('image'), async (req, res) => {
    try {
        const { name, email, mobileNo, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ email });
        const existingUsermobile = await User.findOne({ mobileNo });
        if (existingUser) {
            return res.status(200).json({ type: "error", message: 'Email already exists' });
        }
        if (existingUsermobile) {
            return res.status(200).json({ type: "error", message: 'Mobile No already exists' });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            mobileNo,
            password: hashedPassword,
        });

        if (req.file) {
            const extension = path.extname(req.file.originalname);
            const imageFilename = `${newUser.name}${newUser._id}${extension}`;
            const imagePath = `imageUploads/frontend/users/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);

            newUser.image = imagePath;
        }


        await newUser.save();
        res.status(200).json({ type: "success", message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ type: "error", message: 'Internal Server Error' });
        console.log(error)
    }
});

// login
route.post('/login', async (req, res) => {
    try {
        const { mobileNo, password } = req.body;

        const user = await User.findOne({ mobileNo });
        if (!user) {
            return res.status(200).json({ type: "error", message: 'Invalid Mobile No.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(200).json({ type: "error", message: 'Invalid Password.' });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, secretKey);

        return res.status(200).json({ type: "success", message: 'Login successful.', token });

    } catch (error) {
        res.status(500).json({ type: "error", message: 'Internal Server Error' });
    }
});


// get all the User
route.get('/get/all', adminMiddleWare, async (req, res) => {
    try {
        const user = await User.find().sort({ createdAt: -1 });
        if (user.length === 0) {
            return res.status(200).json({ type: "error", message: 'No forms found', form: [] });
        }

        const newUser = user.map(users => {

            const imageUrls = (`${process.env.IMAGE_ADDRESS}/${users?.image}`);

            return {
                ...users.toObject(),
                image: imageUrls,

            };
        })
        res.status(200).json({ type: "success", message: " User found successfully!", user: newUser })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});


// get user by token
route.get('/get/single', authMiddleWare, async (req, res) => {
    try {
        // Access the currently logged-in user details from req.user
        const userId = req?.user?.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(200).json({ type: "error", error: 'User not found' });
        }

        const imageUrls = (`${process.env.IMAGE_ADDRESS}/${user?.image}`);
        const newUser = {
            ...user.toObject(),
            image: imageUrls,
        };
        res.status(200).json({ type: "success", message: " User found successfully!", user: newUser })
    }
    catch (error) {
        res.status(500).json({ type: "error", message: 'Internal server error' });
        console.log(error);
    }
});


// Update User Profile
route.patch('/profile/update', authMiddleWare, upload.single('image'), async (req, res) => {
    const userId = req.user.userId;
    const { name, email, mobileNumber } = req.body;
    const originalname = req.file?.originalname;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({ type: "error", message: "User does not exist!" });
        }

        if (mobileNumber && mobileNumber !== user.mobileNo) {
            const existingUserWithMobile = await User.findOne({ mobileNo: mobileNumber });
            if (existingUserWithMobile) {
                return res.status(200).json({ type: "error", message: "User Mobile Number already exists!" });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;
        // user.mobileNo = mobileNumber || user.mobileNo;

        if (req.file) {
            const extension = path.extname(originalname);
            const imageFilename = `${user.name}${user._id}${extension}`;
            const imagePath = `imageUploads/frontend/users/${imageFilename}`;

            fs.renameSync(req?.file?.path, imagePath);

            user.image = imagePath;
        }

        await user.save();
        res.status(200).json({ type: "success", message: "User updated successfully!" });
    } catch (error) {
        try {
            if (req.file) {
                fs.unlinkSync(req?.file?.path);
            }
        } catch (error) {

        }
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!" });
    }
});


// delete all user
route.delete('/delete/all', adminMiddleWare, async (req, res) => {

    try {

        const users = await User.find();

        for (const user of users) {
            try {
                try {
                    if (user.image && fs.existsSync(user?.image?.path)) {
                        fs.unlinkSync(user?.image?.path);
                    }
                } catch (error) {

                }
            } catch (error) {

            }
        }

        await User.deleteMany()
        res.status(200).json({ type: "error", message: "All Users deleted Successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
})

// Delete many users
route.delete('/deletes', adminMiddleWare, async (req, res) => {
    try {
        const { ids } = req.body;
        const users = await User.find({ _id: { $in: ids } });

        for (const user of users) {
            try {
                if (user.User_Image && fs.existsSync(user?.User_Image?.path)) {
                    fs.unlinkSync(user?.User_Image?.path);
                }
            } catch (error) {

            }
        }

        await User.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Users deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete User by ID
route.delete('/delete/:id', adminMiddleWare, async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ type: "error", message: "User not found!" });
        } else {
            try {
                if (user.User_Image && fs.existsSync(user?.User_Image?.path)) {
                    fs.unlinkSync(user?.User_Image?.path);
                }
            } catch (error) {

            }

            await User.findByIdAndDelete(userId);
            res.status(200).json({ type: "success", message: "User deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});


module.exports = route