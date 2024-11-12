const sql = require("mssql");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dbConfig = require("../dbConfig");

//User class
//Mongoose trying
const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true }, 
        password: { type: String, required: true}
    }
);
const User = mongoose.model('Users',userSchema)

module.exports = User;