const express = require('express');
const bodyParser = require("body-parser");
const sql = require("mssql");
const mongoose = require("mongoose");
const dbConfig = require("./dbConfig");
const userController = require("./controllers/userController");
const dbURI = "mongodb+srv://Chimken:FMGSOzqLy1SegpFI@fsdpassignment.p4h2x.mongodb.net/"

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


//User
app.get("/user",userController.getAllUser);
app.post("/user",userController.createUser);


// Start the server and connect to the database
app.listen(port, async () => {
    try {
      // await sql.connect(dbConfig);
      mongoose.connect(dbURI);
      console.log(`Database connected and server running on port ${port}`);
    } catch (err) {
      console.error('Database connection error:', err);
      process.exit(1);
    }
  });
   
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    // await sql.close();
    mongoose.connection.close();
    process.exit(0);
  });
   


