import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan';
import connectWithDb from './config/db.js';
import authRoute from './route/authRoute.js';
import categoryRoute from './route/categoryRoute.js'
import productRoute from './route/productRoute.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use(morgan('dev'));
connectWithDb();
app.use(cors());


app.use("/api/ecom", authRoute);
app.use("/api/ecom", categoryRoute)
app.use("/api/ecom", productRoute)


const PORT = process.env.PORT || 5000;
const MODE = process.env.MODE || PRO;
const localhost = process.env.localhost || '127.0.0.2';

app.listen(PORT, localhost, () => {
    console.log(`Server started at http://${localhost}:${PORT} in ${MODE} mode`);
});