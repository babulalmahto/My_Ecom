const Mongoose = require("mongoose");



const connectDB = async () => {
    try {
        await Mongoose.connect('mongodb://localhost:27017/eCom');
        console.log("DB Connected");
    } catch (error) {
        // console.log(error);
        console.log("DB not connected")

    }
}
module.exports = connectDB;
