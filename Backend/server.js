require('dotenv').config()

const dns = require('dns')
// 👇 FIX: Node.js ko explicitly Google ke DNS servers use karne bolo
dns.setServers(['8.8.8.8', '8.8.4.4'])

const app = require('./src/app')
const connectToDB = require('./src/config/database')


connectToDB()



app.listen(3000, () => {
    console.log('Server is running on PORT 3000');
})