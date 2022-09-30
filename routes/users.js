const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')


// Getting all
router.get('/', async (req, res) => {
    try{
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
// Getting One
router.get('/:id', getUser, (req, res) => {
    res.send(res.user)
    // Getting the name only
    // res.send(res.user.name) 
})
// Get By Email
router.get('/email/:email/:password', getUserByEmail, (req, res) => {
    res.send(res.user)
})

// Creating One
router.post('/', async (req, res) => {
    const passwordHashed = await bcrypt.hash(req.body.password, 10)

    const user = new User({
        name: req.body.name,
        password: passwordHashed,
        email: req.body.email,
        dateCreated: req.body.dateCreated
    })
    try{
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err){
        res.status(400).json({ message: err.message })
    }

})

// Updating One
router.patch('/:id', getUser, async (req, res) => {
        if(req.body.name != null){
            res.user.name = req.body.name
        }
        if (req.body.password != null){
            res.user.password = req.body.password
        }
        if (req.body.email != null){
            res.user.email = req.body.email
        }
        try {
            const updatedUser = await res.user.save()
            res.json(updatedUser)
        } catch (err) {
            res.status(400).json({message: err.message})
        }
})
// Deleting One
router.delete('/:id', getUser, async (req, res) => {
    try{
        await res.user.remove()
        res.json({ message: 'Deleted User' })
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})

async function getUser(req, res, next){
    let user
    try{
        user = await User.findById(req.params.id)
        if(user == null){
            return res.status(404).json({ message: 'Cannot find user' })
        }
    }catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.user = user
    next()
}

async function getUserByEmail(req, res, next){
    let user
    try{
        user = await User.findOne({email: req.params.email})
        if(user == null || user == []){
            return res.status(404).json({ message: 'Cannot find user with that email' })
        }
        if(user && (await bcrypt.compare(req.params.password, user.password))){
            res.user = user
        }else{
            res.status(400)
            throw new Error('Invalid credentials')
        }
    }catch (err) {
        return res.status(500).json({message: err.message})
    }

    next()
}


module.exports = router