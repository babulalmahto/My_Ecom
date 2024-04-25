const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectWithDb = require('./model/db');
const authRouter = require('./router/auth.router');

dotenv.config();
app.use(express.json());
app.use(morgan('dev'));
connectWithDb();
app.use(cors());


app.use("/api/ecom", authRouter)


const PORT = process.env.PORT || 5000;
const MODE = process.env.MODE || PRO;
const localhost = process.env.localhost || '127.0.0.2';

app.listen(PORT, localhost, () => {
    console.log(`Server started at http://${localhost}:${PORT} in ${MODE} mode`);
});