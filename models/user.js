const sql = require("mssql");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dbConfig = require("../dbConfig");

//User class
//Mongoose trying
const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true }, 
        password: { type: String, required: true}
    }
);
const User = mongoose.model('Users',userSchema)

// class User
// {
//     constructor(userId, name, email, password)
//     {
//         this.userId = userId;
//         this.name = name;
//         this.email = email;
//         this.password = password;
//     }


//     static async getAllUser()
//     {
//         const connection = await sql.connect(dbConfig);
//         const sqlQuery = `SELECT * FROM Users`;
//         const request = connection.request();
//         const result = await request.query(sqlQuery);
//         connection.close();
//         return result.recordset.map
//         (
//             (row) => new User(row.userId, row.name, row.email, row.password)
//         );
//     }

//     static async createUser(newUserData)
//     {
//         const connection = await sql.connect(dbConfig);
//         const sqlQuery = `INSERT INTO Users (name, email, password) VALUES (@name, @Email, @Password)`
//         const request = connection.request();
//         request.input('name',newUserData.name);
//         request.input('email', newUserData.email);
//         request.input('password',newUserData.password);
//         const result = await request.query(sqlQuery);
//         connection.close();
        
//         return result.rowsAffected > 0;
//     }

// }




module.exports = User;
