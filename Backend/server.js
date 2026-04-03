require('dotenv').config()

const dns = require('dns')
// Node.js ko explicitly Google ke DNS servers use karne bolo
dns.setServers(['8.8.8.8', '8.8.4.4'])

const app = require('./src/app')
const connectToDB = require('./src/config/database')

connectToDB()

// 👇 FIX: Render ke liye dynamic PORT set kiya
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})