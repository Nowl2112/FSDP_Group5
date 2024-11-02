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
}

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

const loginUser = async(req,res)=>
{
    try
    {
        const user = await User.findOne({ email: req.body.email });
        if(user.password == req.body.password)
        {
            res.status(201).send(user);
            return true;
        }
    }
    catch(err)
    {
        console.error(err);
    }
}


module.exports =
{
    getAllUser,
    createUser,
    loginUser,
}

