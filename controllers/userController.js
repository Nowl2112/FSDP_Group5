const User = require("../models/user");


require('dotenv').config();
const { error } = require("console");
const {user} = require("../dbConfig");

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const getAllUser = async(req,res)=>
{
    User.find()
    .then((result) =>
    {
        res.status(201).send(result)
    })
    .catch((err)=>
        {
            console.log(err);
        })
}

const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password with salt rounds
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword, // Save hashed password
        });
        const result = await user.save();
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error creating user" });
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password); // Compare hashed password
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid email or password" });
        }

        // Generate a JWT token upon successful login (optional)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).send({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error logging in" });
    }
};


module.exports =
{
    getAllUser,
    createUser,
    loginUser,
}