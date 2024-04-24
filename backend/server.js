const express = require('express');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;
const MODE = process.env.MODE || PRO;
const localhost = process.env.localhost || '127.0.0.2';

app.listen(PORT, localhost, () => {
    console.log(`Server started at http://${localhost}:${PORT} in ${MODE} mode`);
});