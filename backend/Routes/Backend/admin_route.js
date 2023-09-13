const express = require('express')
const route = express.Router()
const User = require('../../Models/Frontend/user_model')
const bcrypt = require('bcrypt')
const multer = require('multer')
const jwt = require('jsonwebtoken');
const adminMiddleWare = require('../../Middleware/adminMiddleware')
const Admin = require('../../Models/Bakcend/admin_model')
const fs = require('fs');
const path = require('path')

const secretKey = process.env.JWT_TOKEN;

// Sign Up Route
route.post('/create', async (req, res) => {
    try {

        const { name, email, mobileNo, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingAdmin = await Admin.findOne({ email });
        const existingAdminmobile = await User.findOne({ mobileNo });
        if (existingAdmin) {
            return res.status(200).json({ type: "error", message: 'Email already exists' });
        }
        if (existingAdminmobile) {
            return res.status(200).json({ type: "error", message: 'Mobile No already exists' });
        }

        // Create a new user
        const newAdmin = new Admin({
            name,
            email,
            mobileNo,
            password: hashedPassword,
        });


        await newAdmin.save();
        res.status(200).json({ type: "success", message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ type: "error", message: 'Internal Server Error' });
        console.log(error)
    }
});


// login
route.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ name: username });

        if (!admin) {
            return res.status(200).json({ type: "error", message: '*Invalid UserName & Paassword.' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(200).json({ type: "error", message: '*Invalid Password.' });
        }

        const token = jwt.sign({ adminId: admin._id, email: admin.email }, secretKey);

        return res.status(200).json({ type: "success", message: 'Login successful.', token });

    } catch (error) {
        res.status(500).json({ type: "error", message: 'Internal Server Error' });
    }
});


// get all the Admin
route.get('/get/all', async (req, res) => {
    try {
        const admin = await Admin.find().sort({ createdAt: -1 });
        res.status(200).json({ type: "success", message: " Admin found successfully!", admin: admin })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});


route.get('/checkAdmin', adminMiddleWare, (req, res) => {
    res.status(200).json({ type: "success", message: "User is an admin" });
});


module.exports = route