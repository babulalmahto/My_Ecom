const express = require('express');
const dotenv = require('dotenv');
const cors=require('cors');
const morgan=require('morgan');
const connectDB = require('./model/db');
const app = express();

dotenv.config();
app.use(express.json());
app.use(morgan('dev'));
connectDB();
app.use(cors());


const PORT = process.env.PORT || 5000;
const MODE = process.env.MODE || PRO;
const localhost = process.env.localhost || '127.0.0.2';

app.listen(PORT, localhost, () => {
    console.log(`Server started at http://${localhost}:${PORT} in ${MODE} mode`);
});