const express = require('express')
const User = require('../models/user')
const multer = require('multer')
const { sendWelcomeEmail, cancelationEmail } = require('../emails/account')
const sharp = require('sharp')
const router = express.Router()
const auth = require('../middleware/auth');

router.post('/user', async (req, res) => {
    let { 
        name,
        age,
        password,
        email
     } = req.body 
     const user = new User({
         name,
         age,
         password,
         email
     })
     await user.save()
     sendWelcomeEmail(user.name, user.email);
     const token = await user.generateAuthToken()
     try{
        res.status(201).send({
            user,
            token
        })
     }catch(e){
        console.log(e)
     }
})

router.post('/user/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user,  token})
    }catch(e){
        res.status(404).send()
    }
    
 
})

router.post('/user/logout', auth, async (req, res) => {

    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
            
        })
        
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        
req.user.tokens = []
await req.user.save()
res.send()


    }catch(e){
        res.status(500).send()
    }
})

router.get('/user/me', auth, async (req, res) => {
  
  res.send(req.user) 
  
  // User.find({}).then((users)=> {
    //     res.send(
    //         users)
    // }).catch((err) =>{
    //     if(err) throw err
    // })
})

// I COMMENTED OUT GETTING USER BY ID COS WE ARE ALREADY RETURNING USER PROFILES AFTER AUTHENTICATING....ON THE USER/ME GET REQUEST ROUTE

// router.get('/user/:id', async (req, res) => {
    
//     const user = await User.findById({_id: req.params.id})
//     if(!user){
//         return res.status(404).send({
//             user: "not found"
//         })
//     }

//     try{
//         res.send(user)
//     }catch(e) {
//     console.log(e)
//     }
//     // User.findById({_id: req.params.id}).then((user) =>{
//     //     res.status(200).send({user})
//     // }).catch((err)=>{
//     //     console.log(err)
//     // })
// })

router.patch('/user/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'error'})
    }
    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        
        const user = req.user

        updates.forEach((update) =>{ user[update] = req.body[update]} )
        await user.save()

        
        res.send(user)

    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})

router.delete('/user/me', auth, async (req, res) => {
    try{
       await req.user.remove()
       cancelationEmail(req.user.name, req.user.email)
       res.send(req.user)
    }catch(e){
        console.log(e)
    }
})

const upload = multer({
   
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){

        if(! file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload an image '))
        }
    cb(undefined, true)


    }
}) 
router.post('/user/me/avatar', auth, upload.single('avatar'),  async (req, res) => {
    
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/user/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send(200)
})


router.get('/user/:id/avatar', async (req, res)=> {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send()
    }
})
module.exports = router;