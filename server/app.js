require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 8000
const dbURI = process.env.MONGO_URI
app.use(cors({
  origin: 'http://localhost:5173',
  credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

async function  MONGO() {
    await mongoose.connect(dbURI)
}

MONGO().then(()=>{
    console.log('Congrats got connected to the mongodb');
}).catch((error)=>{console.log('got some error here ',error);})

app.use('/api/auth',require('./routes/auth'))
app.use('/api/videos',require('./routes/story'))

app.use("/videos", express.static("temp"));
// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  // Set default values if not provided
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  console.error(`[ERROR] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
};


app.listen(PORT,()=>{
    console.log(`PORT is Listening at ${PORT}`);
    
})
