// Required
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Chart = require('chart.js');
const Sequelize = require('sequelize');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// vars
const router = express.Router();
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

const app = express();

// Connect to the database

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'app.db'
});

// User Model
class User extends Sequelize.Model {}
User.init({
    user: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    secret: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    sequelize
});

// Initialize Table
(async () => {
    // remove force later
    await sequelize.sync({
        force: true
    });


    try {
        const user = await User.create({
            user: 'gabbyv',
            secret: 'hash'
        });
        // const user = await User.create({
        //     user: 'gerardv',
        // });
        console.log(user.toJSON());
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// END USER MODEL

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use('/static', express.static('public'));

// Pug Enabled ?
app.set('view engine', 'pug');

// Routes
const mainRoutes = require('./routes');

app.get("/", function (req, res) {
    res.render('login');
    res.end();
});

app.get("/dashboard", function (req, res) {
    res.render('index');
    res.end();
});

app.get("/reports", function (req, res) {
    res.render('reports');
    res.end();
});

app.post("/", function (req, res) {
    res.redirect("/dashboard");
    res.end();
});

// Creating a User and storing it to DB
app.post("/register", asyncHandler(async function (req, res) {
    
    let newUser = await User.create({
        user: req.body.username,
        secret: req.body.password
    })
    res.redirect("/");
    res.end();
}));

// app.post("/", function(req, res){
//     res.redirect("/#batteryEncoding");
//     res.end();
// })

// Login Page
// Accept Username
// Accept Password
// Verify credentials
// Sign in

// Register Page
// Accept username
// Accept Password
// Verify credentials
// Admin approval
// Create account

// Charging Boy dashboard
// Encoding Section
// Select Encoding Button
// Battery Encoding
// Pop up Form Generated
// Select Category -- UNIT IN/UNIT OUT/CHARGE IN/CHARGE OUT
// Encode Data -- VOLTAGE. UNIT. DRIVER. TIME. DATE.
// Store Data

// Collection Encoding
// Pop up Form Generated
// Encode Data
// Store Data

// Akelco Reading
// Pop up Form Generated
// Encode Data
// Store Data
// Table of Records
// Organize by latest swaps. Batteries Out. Pending Collectibles.
// Read data set
// Display by earliest OUT record.
// DATE OUT / TIME OUT
// DATE IN / TIME IN

// Admin dashboard
// Main
// Summary of Units Operating
// Collection Report
// Boundary
// Battery Rent
// Electricity Fee
// Akelco Reading
// Electricity Cost Estimate
// Daily
// Billing month-to-date

app.listen(port, function () {
    console.log(`The application is running on localhost:${port}!`)
});