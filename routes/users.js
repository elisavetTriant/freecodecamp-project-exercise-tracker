const { Router } = require('express')
const userModel = require('../models/User')


const router = Router();


//Get all users from the database
router.get('/', async (req, res) => {
    try {
        const users = await userModel.find({})
        res.status(200).json(users);
    }catch (err) {
        res.status(200).json({error: err});
    } 
        
})

//Register a user
router.post('/', (req, res) => {

    try {
        const newUser = new userModel({username: req.body.username, log: []})
        // save the object in the database
        newUser.save((errSaved, userSaved) => {
        if (errSaved) {
            res.status(200).json({err: errSaved});
        }
        const { _id, username } = userSaved;
        res.status(200).json({
            username,
            _id
          });
        })
    }catch (err) {
        res.status(200).json({error: err});
    } 
        
})

module.exports = router;