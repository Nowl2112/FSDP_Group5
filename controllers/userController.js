const User = require("../models/user");

const getAllUser = async(req,res)=>
{
    try
    {
        const user = await User.getAllUser();
        res.json(user);
    }
    catch(error)
    {
        console.error(error);
        res.status(500).send("Error retrieving Users")
    }
}

const createUser = async(req,res)=>
{
    const newUser = req.body
    try
    {
        const createdUser = await User.createUser(newUser);
        res.status(201).send("User successfully created");
    }
    catch(error)
        {
            console.error(error);
            res.status(500).send("Error creating User");
        }
};



module.exports =
{
    getAllUser,
    createUser,
}

