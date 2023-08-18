require('dotenv').config()
const mongoose = require('mongoose')
// const MONGO_URI =
//     'mongodb+srv://sarthak:ACxgVLTpeWNwzWVY@cluster0.1hrvz.mongodb.net/'
const MONGO_URI = process.env.MONGO_URI
const MongoDBConnect = () => {
    try {
        mongoose.connect(
            MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                keepAlive: true,
            },
            () => {
                console.log('MongoDB is Connected.')
            }
        )
    } catch (err) {
        console.log('error connecting mongdoDb' + err)
    }
    const connection = mongoose.connection

    connection.on('error', (err) => {
        console.log(`Connection Error: ${err}`)
    })

    connection.once('open', () => {
        console.log('Connected to DB!')
    })
}
module.exports = MongoDBConnect
