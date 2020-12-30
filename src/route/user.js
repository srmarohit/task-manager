const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { subscribeMail, unsubscribeMail } = require('../sendGrid/email');

router.get('/users/me', auth, async (req, res) => {
    /* try {
        const users = await User.find();
        if (!users)
            return res.status(404).send("No users is found in database.");

        res.status(200).send(users);
    }
    catch (e) {
        console.log("Error : Internal Error to get users list " + e);
        res.status(500).send("Error : Internal Server error to get Users.." +e);
    } */

    res.status(200).send(req.user);
});

   // Register a User
 router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        subscribeMail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }
    catch (e) {
        console.log("Error : Internal Error to add user list " + e);
        res.status(500).send("Error : Internal Server error to add User.." + e);
    }
}); 

// Access Login Section with middleware.
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.logIn(req.body.email, req.body.password);
                   // Genrate token for each instance of User Model
        const token = await user.generateAuthToken();
        res.status(200).send({user, token});
    }
    catch (e) {
        console.log("Invalid Credetial : " + e);
        res.status(400).send("Invalid Credential : " + e);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
              // return all tokens in a array except that token == req.token .
            return token.token !== req.token
        });

        await req.user.save();
        res.send();
      }
    catch (e) {
        res.status(500).send();
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send();
    }
});

/* router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user)
            return res.status(404).send("Error : data not found..!");

        res.status(203).send(user);
    }
    catch (e) {
        console.log("Error : Internal Error to add find user by id " + e);
        res.status(500).send("Error : Internal Server error to find User.." + e);
    }
});     */

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdate = ['name','age','password'];
    const isValidate = updates.every(update => allowUpdate.includes(update));   // return Boolean result

    if (!isValidate)
        return res.status(401).send("Error : update parameter is invalid or not allowed to update..");

    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        //We use different terminology to update data and hashing password to using middleware ..

        // const user = await User.findById(req.params.id);
        // Actually we already have user in req.user term

        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        
        res.status(200).send(req.user);
    }
    catch (e) {
        console.log("Error : Internal Error to update user by id " + e);
        res.status(500).send("Error : Internal Server error to update User.." + e);
    }
});

 router.delete('/users/me', auth, async (req, res) => {
     try {
        unsubscribeMail(req.user.email, req.user.name);
        await req.user.remove();
        res.status(204).send(req.user);
    }
    catch (e) {
        console.log("Error : Internal Error to delete user by id " + e);
        res.status(500).send("Error : Internal Server error to delete User.." + e);
    }
 });  

const uploads = multer({
    limits: {
        fileSize: 10000000
    },              // allowed 10mb size 
    fileFilter(req, file, cb) {
        if (! file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            return cb(new Error('please upload appropriate format of image..'));
        }

        cb(undefined, true);
    }
});

router.post('/users/me/avator', auth, uploads.single('dp'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer();
    req.user.avator = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
        res.status(400).send({Error : error.message});
});

router.delete('/users/me/avator', auth, async (req, res) => {
    try {
        req.user.avator = undefined;
        await req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send({ error: "unable to delete profile pic.." });
    }
});

router.get('/users/:id/avator', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avator) {
            console.log("user not found..");
            throw new Error("User or Users profile pic not found..");
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avator);
    }
    catch (e) {
        res.status(404).send({error : e.message});
    }
});








module.exports = router;