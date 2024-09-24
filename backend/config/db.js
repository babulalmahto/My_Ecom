import mongoose from 'mongoose';

const db_url = "mongodb://127.0.0.1:27017/my_ecom";

const connectWithDb = async () => {
    try {
        await mongoose.connect(db_url)
        console.log("connected with Db")
    } catch (err) {
        console.log("not able connect with db", err);
    }
}

export default connectWithDb