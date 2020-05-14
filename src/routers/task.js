const express = require('express')
const auth = require('../middleware/auth')
const Tasks = require('../models/task')
const router = express.Router()



router.post('/task', auth, async (req,res) => {

     const task = new Tasks({
        ...req.body,
        owner: req.user.
        _id
     })
    

    try {

        await task.save()
        res.status(201).send(task)
    }catch(e) {
        console.log(e)
    }
    
})

router.get('/task', auth, async (req, res) => {

     const match = {}
     const sort = {}

     if(req.query.completed) {
         match.completed = req.query.completed === 'true'
     }

     if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
     }
   
   try{
       await req.user.populate({
        path: 'task',
        match,
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
    }).execPopulate()
    res.send(req.user.task)
   }catch(e) {
       res.status(500).send()
   }
})

router.get('/task/:id', auth, async (req,res) => {
    let _id = req.params.id
    
    try{
        const task = await Tasks.findOne({ 
            _id, owner: req.user._id
        })
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e) {
        console.log(e)
    }
})


router.patch('/task/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


    if(!isValidOperation){
        return res.status(400).send({error: 'error handling your request'})
    }

    try{
        // const user = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true })
        const task = await Tasks.findOne({_id: req.params.id, owner: req.user._id})
        
        
       

        if(!task){
            res.status(40
                ).send()
        }
        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()
        res.send(task)

    }catch(e){
        res.status(404).send({
            "error": "the task you re trying to update does not exist"
        })
    }
})

router.delete('/task/:id', auth,  async (req,res) =>{
    try{
        const task = await Tasks.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
           return res.status(404).send({
                error: 'user not found'
            })
           
        }
        res.status(202).send()
    }catch(e){
        res.status(500).send(task)
    }
})

module.exports = router;