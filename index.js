const express = require('express')
const cors = require('cors')
const connectToDatabase = require('./database/connection')

connectToDatabase()
const app = express()
const port = process.env.PORT || 4000
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to slot booking system')
})

app.use('/slot', require('./routes/slotRoutes'))
app.use('/student', require('./routes/studentRoutes'))
app.use('/dean', require('./routes/deanRoutes'))

app.listen(port, () => {
    console.log(`App listening at PORT:${port}`)
})
