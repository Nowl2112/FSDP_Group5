const User = require("../models/user");

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
    

    // try
    // {
    //     const user = await User.getAllUser();
    //     res.json(user);
    // }
    // catch(error)
    // {
    //     console.error(error);
    //     res.status(500).send("Error retrieving Users")
    // }
}

// const createUser = async(req,res)=>
// {
//     const newUser = req.body
//     try
//     {
//         const createdUser = await User.createUser(newUser);
//         res.status(201).send("User successfully created");
//     }
//     catch(error)
//         {
//             console.error(error);
//             res.status(500).send("Error creating User");
//         }
// };

const createUser = async(req,res)=>
{
    const user = new User(
        {
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
        }
    );
    await user.save()
    .then((result)=>
    {
        res.status(201).send(result)
    })
    .catch((err)=>
    {
        console.log(err);
    })
}


module.exports =
{
    getAllUser,
    createUser,
}

