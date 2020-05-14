const express = require('express');
const app = express()
require('./db/mongoose')
const User = require('../src/models/user')
const Tasks = require('../src/models/task')
const auth = require('./middleware/auth')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const PORT = process.env.PORT

// app.use((req, res, next) => {
//     if(req.method === 'GET'){
//         res.status(503).send({
//             error: "issues connecting to the server atm"
//         })
//     }else {
//         next()
//     }
// })
app.use(express.json())



app.use(userRouter)
app.use(taskRouter)


app.listen(PORT, (err)=> {
    if(err) throw err

    console.log(`server is ow running on port ${PORT}`)
})


const pet = {
    "name": "hassan",
    "surname": "sazee"
}

pet.toJSON = function() {
    return pet.name
}

console.log(JSON.stringify(pet))