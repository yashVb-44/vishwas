const express = require('express')
const route = express.Router()
const User = require('../../Models/Frontend/user_model')
const Form = require('../../Models/Bakcend/form_model')
const multer = require('multer')
const jwt = require('jsonwebtoken');
const authMiddleWare = require('../../Middleware/authMiddleware')
const adminMiddleWare = require('../../Middleware/adminMiddleware')
const fs = require('fs');
const path = require('path')
const { formatDistanceToNow } = require('date-fns');


// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "imageUploads/backend/forms");
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split(".").pop();
        cb(null, `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`);
    },
});

const upload = multer({ storage: storage })

// Create Form Route
route.post('/create', authMiddleWare, upload.array('images'), async (req, res) => {
    const { type, name, age, address, state, city, mobileNo, details, contactDetails, extraDetails, date } = req.body;

    const userId = req.user?.userId

    try {
        const images = req.files.map(file => {
            const extension = path.extname(file.originalname);
            const imageFilename = `${name}_${Date.now()}${extension}`;
            const imagePath = `imageUploads/backend/forms/${imageFilename}`;

            fs.renameSync(file?.path, imagePath);
            return imagePath;
        });

        const newForm = new Form({
            user: userId,
            type,
            name,
            age,
            address,
            state,
            city,
            mobileNo,
            details,
            contactDetails,
            extraDetails,
            images,
            date
        });

        await newForm.save();
        res.status(200).json({ type: "success", message: "Form created successfully!" });
    } catch (error) {
        try {
            if (req?.files) {
                req.files.forEach(file => fs.unlinkSync(file?.path));
            }
        } catch (error) {

        }
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!" });
    }
});

// get all the forms
route.get('/get/all/byadmin', adminMiddleWare, async (req, res) => {
    try {
        const forms = await Form.find().sort({ createdAt: -1 }).populate({
            path: 'user',
            select: 'name image mobileNo'
        })
        if (forms.length === 0) {
            return res.status(200).json({ type: "error", message: 'No forms found', form: [] });
        }

        const newForms = forms.map(form => {
            let status = '';
            let type = ''
            if (form?.status === "0") {
                status = 'Pending';
            } else if (form?.status === "1") {
                status = 'Approved';
            } else {
                status = 'Complete';
            }

            if (form?.type === "0") {
                type = 'All';
            } else if (form?.type === "1") {
                type = 'Criminal';
            } else if (form?.type === "2") {
                type = 'Lost';
            } else {
                type = 'Dead';
            }

            const imageUrls = form.images.map(imagePath => `${process.env.IMAGE_ADDRESS}/${imagePath}`)
            const userImage = `${process.env.IMAGE_ADDRESS}/${form?.user?.images}`;
            const createdAt = formatDistanceToNow(form.createdAt, { addSuffix: true });
            const date = form?.createdAt.toLocaleDateString(); // Format as date
            const time = form?.createdAt.toLocaleTimeString(); // Format as time

            return {
                ...form.toObject(),
                type: type,
                status: status,
                images: imageUrls,
                address: form?.address || "",
                date: form?.date || "",
                formDate: date || "",
                formTime: time || "",
                userName: form?.user?.name,
                userImage: userImage,
                userMobNo: form?.user?.mobileNo || "",
                createDate: createdAt || ""

            };
        });

        res.status(200).json({ type: "success", message: " Forms found successfully!", form: newForms || [] })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)

    }
});

// get all the forms
route.get('/get/all', async (req, res) => {

    let type = req.query.type

    try {
        let forms
        if (type === "0") {
            forms = await Form.find({ status: { $ne: '0' } }).sort({ createdAt: -1 }).populate({
                path: 'user',
                select: 'name image'
            })
        }
        else {
            forms = await Form.find({ status: { $ne: '0' }, type: type }).sort({ createdAt: -1 }).populate({
                path: 'user',
                select: 'name image'
            })
        }

        if (forms.length === 0) {
            return res.status(200).json({ type: "error", message: 'No forms found', form: [] });
        }

        const newForms = forms.map(form => {
            let status = '';
            let type = ''
            if (form?.status === "0") {
                status = 'Pending';
            } else if (form?.status === "1") {
                status = 'Approved';
            } else {
                status = 'Complete';
            }

            if (form?.type === "0") {
                type = 'All';
            } else if (form?.type === "1") {
                type = 'Criminal';
            } else if (form?.type === "2") {
                type = 'Lost';
            } else {
                type = 'Dead';
            }

            const imageUrls = form.images.map(imagePath => `${process.env.IMAGE_ADDRESS}/${imagePath}`);
            const userImage = `${process.env.IMAGE_ADDRESS}/${form?.user?.images}`;
            const createdAt = formatDistanceToNow(form.createdAt, { addSuffix: true });

            return {
                ...form.toObject(),
                type: type || "",
                status: status || "",
                images: imageUrls || "",
                address: form?.address || "",
                date: form?.date || "",
                userName: form?.user?.name || "",
                userImage: userImage || "",
                createDate: createdAt || ""
            };
        });

        res.status(200).json({ type: "success", message: " Forms found successfully!", form: newForms || [] })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// get all form for prticular user
route.get('/get/userdata/all', authMiddleWare, async (req, res) => {
    let type = req.query.checkType

    try {

        const userId = req.user?.userId;
        let form
        if (type === "0") {
            form = await Form.find({ user: userId }).sort({ createdAt: -1 }).populate({
                path: 'user',
                select: 'name image'
            })
        }
        else {
            form = await Form.find({ user: userId, type: type }).sort({ createdAt: -1 }).populate({
                path: 'user',
                select: 'name image'
            })
        }

        if (form.length === 0) {
            return res.status(200).json({ type: "error", message: 'No forms found', form: [] });
        }

        if (!form) {
            return res.status(200).json({ type: "error", error: 'Form not found', form: form || [] });
        }

        const newForms = form.map(form => {
            let status = '';
            let type = ''
            if (form?.status === "0") {
                status = 'Pending';
            } else if (form?.status === "1") {
                status = 'Approved';
            } else {
                status = 'Complete';
            }

            if (form?.type === "0") {
                type = 'All';
            } else if (form?.type === "1") {
                type = 'Criminal';
            } else if (form?.type === "2") {
                type = 'Lost';
            } else {
                type = 'Dead';
            }

            const imageUrls = form.images.map(imagePath => `${process.env.IMAGE_ADDRESS}/${imagePath}`);
            const userImage = `${process.env.IMAGE_ADDRESS}/${form?.user?.images}`;
            const createdAt = formatDistanceToNow(form.createdAt, { addSuffix: true });

            return {
                ...form.toObject(),
                type: type || "",
                status: status || "",
                images: imageUrls || "",
                date: form?.date || "",
                address: form?.address || "",
                userName: form?.user?.name || "",
                userImage: userImage || "",
                createDate: createdAt || ""
            }
        })

        res.status(200).json({ type: "success", form: newForms || [] });
    } catch (error) {
        res.status(500).json({ type: "error", message: 'Internal server error' });
        console.log(error);
    }
});

// get single form for prticular user
route.get('/get/single/:id', async (req, res) => {
    try {
        const formId = req.params?.id
        let form = await Form.findById(formId).populate({
            path: 'user',
            select: 'name image'
        })

        if (!form) {
            return res.status(200).json({ type: "error", error: 'Form not found', form: form || [] });
        }

        form = [form]

        const newForms = form.map(form => {
            let status = '';
            let type = ''
            if (form?.status === "0") {
                status = 'Pending';
            } else if (form?.status === "1") {
                status = 'Approved';
            } else {
                status = 'Complete';
            }

            if (form?.type === "0") {
                type = 'All';
            } else if (form?.type === "1") {
                type = 'Criminal';
            } else if (form?.type === "2") {
                type = 'Lost';
            } else {
                type = 'Dead';
            }

            const imageUrls = form.images.map(imagePath => `${process.env.IMAGE_ADDRESS}/${imagePath}`);
            const userImage = `${process.env.IMAGE_ADDRESS}/${form?.user?.images}`;
            const createdAt = formatDistanceToNow(form.createdAt, { addSuffix: true });

            return {
                ...form.toObject(),
                type: type || "",
                status: status || "",
                images: imageUrls || "",
                date: form?.date || "",
                address: form?.address || "",
                userName: form?.user?.name || "",
                userImage: userImage || "",
                createDate: createdAt || ""
            }
        })

        res.status(200).json({ type: "success", form: newForms || [] });
    } catch (error) {
        res.status(500).json({ type: "error", message: 'Internal server error' });
        console.log(error);
    }
});


// get single form 
route.get('/get/admin/single/:id', async (req, res) => {
    try {
        const formId = req.params?.id;
        const form = await Form.findById(formId).populate({
            path: 'user',
            select: 'name image mobileNo'
        });

        if (!form) {
            return res.status(200).json({ type: "error", error: 'Form not found', form: form || [] });
        }

        let status = '';
        let type = '';

        if (form.status === "0") {
            status = 'Pending';
        } else if (form.status === "1") {
            status = 'Approved';
        } else {
            status = 'Complete';
        }

        if (form.type === "0") {
            type = 'All';
        } else if (form.type === "1") {
            type = 'Criminal';
        } else if (form.type === "2") {
            type = 'Lost';
        } else {
            type = 'Dead';
        }

        const imageUrls = form.images.map(imagePath => `${process.env.IMAGE_ADDRESS}/${imagePath}`);
        const userImage = `${process.env.IMAGE_ADDRESS}/${form?.user?.image}`;
        const createdAt = form.createdAt;
        const relativeTime = formatDistanceToNow(createdAt, { addSuffix: true });
        const date = createdAt.toLocaleDateString(); // Format as date
        const time = createdAt.toLocaleTimeString(); // Format as time

        const newForm = {
            ...form.toObject(),
            type: type,
            status: status,
            images: imageUrls,
            address: form?.address || "",
            date: form?.date || "",
            formDate: date || "",
            formTime: time || "",
            userName: form?.user?.name,
            userImage: userImage,
            userMobNo: form?.user?.mobileNo || "",
            createDate: createdAt || ""
        };

        res.status(200).json({ type: "success", form: newForm });
    } catch (error) {
        res.status(500).json({ type: "error", message: 'Internal server error' });
        console.log(error);
    }
});


// Delete All Forms Route
route.delete('/delete/all', adminMiddleWare, async (req, res) => {
    try {
        const forms = await Form.find({});
        forms.forEach(form => {
            if (form.images) {
                try {
                    form?.images?.forEach(imagePath => {
                        fs.unlinkSync(imagePath);
                    });
                } catch (error) {

                }
            }
        });

        await Form.deleteMany({});
        res.status(200).json({ type: "success", message: "All forms deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!" });
    }
});


// Delete Particular Form Route
route.delete('/delete/single/:formId', adminMiddleWare, async (req, res) => {
    try {
        const formId = req.params.formId;
        const form = await Form.findById(formId);

        if (!form) {
            return res.status(404).json({ type: "error", message: "Form not found!" });
        }

        if (form.images) {
            try {
                form.images.forEach(imagePath => {
                    fs.unlinkSync(imagePath);
                });
            } catch (error) {
                // Handle any unlink errors here
            }
        }

        await Form.findByIdAndDelete(formId);
        res.status(200).json({ type: "success", message: "Form deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!" });
    }
});

// Delete Multiple Forms Route
route.delete('/deletes/multiple', adminMiddleWare, async (req, res) => {

    try {
        const { ids } = req.body;
        const forms = await Form.find({ _id: { $in: ids } });

        forms.forEach(async (form) => {
            if (form.images) {
                try {
                    form.images.forEach(imagePath => {
                        fs.unlinkSync(imagePath);
                    });
                } catch (error) {
                    // Handle any unlink errors here
                }
            }
        });
        await Form.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ type: "success", message: "Forms deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!" });
    }
});


// Delete Single Form Route
route.delete('/delete/single/byuser/:formId', authMiddleWare, async (req, res) => {
    const formId = req.params.formId;
    const userId = req.user.userId

    try {
        const form = await Form.findById(formId);
        const user = await form?.user?.toString()

        if (!form) {
            return res.status(200).json({ type: "error", message: "Form not found!" });
        }

        if (userId !== user) {
            return res.status(200).json({ type: "error", message: "User not authenticate to delete this form!" });
        }

        if (form.images) {
            try {
                form.images.forEach(imagePath => {
                    fs.unlinkSync(imagePath);
                });
            } catch (error) {

            }
        }

        await Form.findByIdAndDelete(formId);
        res.status(200).json({ type: "success", message: "Form deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!" });
    }
});

// Update Form Route by user
route.patch('/update/byuser/:formId', authMiddleWare, upload.array('images'), async (req, res) => {
    const formId = req.params.formId;
    const userId = req.user?.userId;

    try {
        const form = await Form.findById(formId);

        if (!form) {
            return res.status(200).json({ type: "error", message: "Form not found!" });
        }

        if (form.user.toString() !== userId) {
            return res.status(200).json({ type: "error", message: "User is not authorized to update this form!" });
        }

        const { name, age, address, state, city, mobileNo, details, contactDetails, extraDetails, date } = req.body;

        // form.type = type;
        form.name = name;
        form.age = age;
        form.address = address;
        form.state = state;
        form.city = city;
        form.mobileNo = mobileNo;
        form.details = details;
        form.contactDetails = contactDetails;
        form.extraDetails = extraDetails;
        form.date = date;

        if (req.files) {
            const updatedImages = req.files.map(file => {
                const extension = path.extname(file.originalname);
                const imageFilename = `${name}_${Date.now()}${extension}`;
                const imagePath = `imageUploads/backend/forms/${imageFilename}`;

                fs.renameSync(file.path, imagePath);
                return imagePath;
            });

            form.images = updatedImages;
        }

        await form.save();
        res.status(200).json({ type: "success", message: "Form updated successfully!" });
    } catch (error) {
        try {
            if (req.files) {
                req.files.forEach(file => fs.unlinkSync(file?.path));
            }
        } catch (error) {

        }
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!" });
    }
});

// Update Form Route by admin
route.patch('/update/byadmin/:formId', adminMiddleWare, upload.array('images'), async (req, res) => {
    const formId = req.params.formId;

    try {
        const form = await Form.findById(formId);

        if (!form) {
            return res.status(200).json({ type: "error", message: "Form not found!" });
        }

        const { name, age, address, state, city, mobileNo, details, contactDetails, extraDetails } = req.body;

        // form.type = type;
        form.name = name;
        form.age = age;
        form.address = address;
        form.state = state;
        form.city = city;
        form.mobileNo = mobileNo;
        form.details = details;
        form.contactDetails = contactDetails;
        form.extraDetails = extraDetails;

        if (req.files) {
            const updatedImages = req.files.map(file => {
                const extension = path.extname(file.originalname);
                const imageFilename = `${name}_${Date.now()}${extension}`;
                const imagePath = `imageUploads/backend/forms/${imageFilename}`;

                fs.renameSync(file.path, imagePath);
                return imagePath;
            });

            form.images = updatedImages;
        }

        await form.save();
        res.status(200).json({ type: "success", message: "Form updated successfully!" });
    } catch (error) {
        try {
            if (req.files) {
                req.files.forEach(file => fs.unlinkSync(file?.path));
            }
        } catch (error) {
            // console.error(error);
        }
        res.status(500).json({ type: "error", message: "Server Error!" });
    }
});

// Update form status by admin
route.patch('/update/status/byadmin/:formId', adminMiddleWare, async (req, res) => {

    const formId = req.params.formId;

    try {
        const form = await Form.findById(formId);

        if (!form) {
            return res.status(200).json({ type: "error", message: "Form not found!" });
        }

        const { status } = req.body;

        form.status = status;


        await form.save();
        res.status(200).json({ type: "success", message: "Form status update successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!" });
    }
});


//  total of forms for admin
route.post('/get/byStatus/forAdmin', adminMiddleWare, async (req, res) => {

    try {
        const { startDate, endDate } = req.body;
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        let ApprovedForm
        let PendingForm
        let CompleteForm
        let totalForm

        if (startDate === "" || endDate === "") {
            totalForm = await Form.find().sort({ updatedAt: -1 });

            PendingForm = await Form.find({
                status: '0',
            }).sort({ updatedAt: -1 });

            ApprovedForm = await Form.find({
                status: '1',
            }).sort({ updatedAt: -1 });

            CompleteForm = await Form.find({
                status: '2',
            }).sort({ updatedAt: -1 });

        }
        else if (startDate !== "" && endDate !== "") {

            totalForm = await Form.find({
                createdAt: { $gte: startDateObj, $lte: endDateObj },
            }).sort({ updatedAt: -1 });

            PendingForm = await Form.find({
                status: '0',
                createdAt: { $gte: startDateObj, $lte: endDateObj },
            }).sort({ updatedAt: -1 });

            ApprovedForm = await Form.find({
                status: '1',
                createdAt: { $gte: startDateObj, $lte: endDateObj },
            }).sort({ updatedAt: -1 });

            CompleteForm = await Form.find({
                status: '2',
                createdAt: { $gte: startDateObj, $lte: endDateObj },
            }).sort({ updatedAt: -1 });

        }

        res.status(200).json({
            type: 'success',
            message: 'Forms retrieved successfully!',
            totalForm: totalForm?.length || 0,
            PendingForm: PendingForm?.length || 0,
            ApprovedForm: ApprovedForm?.length || 0,
            CompleteForm: CompleteForm?.length || 0,
        });

    } catch (error) {
        res.status(500).json({
            type: 'error',
            message: 'Server Error!',
            errorMessage: error.message,
        });
        console.error(error);
    }
});

module.exports = route

