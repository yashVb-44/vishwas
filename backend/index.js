const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path')

const UserRoute = require('./Routes/Frontend/user_route')
const FormRoute = require('./Routes/Backend/form_route')
const AdminRoute = require('./Routes/Backend/admin_route')
const SettingsRoute = require('./Routes/Settings/general_Settings')
const WishList = require('./Routes/Frontend/wishlist_route')

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(express.static('static'))


mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB: ', error);
    });



// const port = process.env.PORT;
const port = process.env.PORT;
const ipAddress = process.env.IP_ADDRESS;

app.use("/imageUploads", express.static("imageUploads"));

app.use("/uploads", express.static("uploads"));

app.use('/user', UserRoute)
app.use('/admin', AdminRoute)
app.use('/form', FormRoute)
app.use('/app/settings', SettingsRoute)
app.use('/wishlist', WishList)

app.get("*", (req, res) => {
    const indexPath = path.join(__dirname, 'static', 'index.html')
    res.sendFile(indexPath)
})

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
