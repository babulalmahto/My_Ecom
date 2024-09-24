import jwt from 'jsonwebtoken';
import { encryptPassword, matchPassword } from '../helper/authHelper.js';
import usersModel from '../model/usersModel.js';

export let registerController = async (req, res) => {
    let { name, email, phone, password, address, answer } = req.body;
    try {
        if (!name) {
            return res.status(500).send({ message: "Name is require *" })
        }
        if (!email) {
            return res.status(500).send({ message: "Email is required *" });
        }
        if (!phone) {
            return res.status(500).send({ message: "Phone number is required *" })
        }
        if (!password) {
            return res.status(500).send({ message: "Password number is required *" })
        }
        if (!address) {
            return res.status(500).send({ message: "Address number is required *" })
        }
        if (!answer) {
            return res.status(500).send({ message: "Answer number is required *" })
        }
        let findUser = await usersModel.findOne({ email: email });
        if (findUser) {
            return res.status(500).send({ message: "User is already register" })
        }
        let hashedPassword = await encryptPassword(password);
        let users = new usersModel({ name, email, phone, password: hashedPassword, address, answer }).save()
        res.status(200).send({ message: "User registered successfully", users, success: true })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Something went worng while registering", success: false, error })

    }
}

export let loginController = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email) {
            return res.status(500).send({ message: "Email is requred *" })
        }
        if (!password) {
            return res.status(500).send({ message: "Password is requred *" })
        }
        let existingUser = await usersModel.findOne({ email: email });
        if (!existingUser) {
            return res.status(200).send({ message: "Either email or password is Invalid" });
        }
        let result = await matchPassword(password, existingUser.password);
        console.log("***", result);
        if (!result) {
            return res.status(200).send({ message: "Either email or password is Invalid *" });
        }

        let token = await jwt.sign({ _id: existingUser._id },
            process.env.SECRET_KEY, { expiresIn: "7d" });
        res.status(200).send({
            message: "User Login Successfully",
            success: true,
            user: {
                name: existingUser.name,
                email: existingUser.email,
                address: existingUser.address,
                phone: existingUser.phone,
                role: existingUser.role

            }, token
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong while login", success: false, error })
    }
}


// This is reset password controller
export let resetPasswordHandler = async (req, res) => {
    try {
        let { email, password, answer } = req.body;
        if (!email) {
            return res.status(500).send({ message: "Email is reqiored *" })
        }
        if (!password) {
            return res.status(500).send({ message: "Password is reqiored *" })
        }
        if (!answer) {
            return res.status(500).send({ message: "Answer is reqiored *" })
        }
        let findData = await usersModel.findOne({ email, answer });
        // console.log(findData);
        if (!findData) {
            return res.status(500).send({ message: "Either email or answer are incorrect" });
        }
        let hashPassword = await encryptPassword(password);
        // console.log(hashPassword);
        await usersModel.findByIdAndUpdate({ _id: findData._id }, { password: hashPassword }, { new: true })
        res.status(200).send({ message: "Password Update Successful", success: true })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong while reset-password", success: false });
    }
}

export let profileUpdateController = async (req, res) => {
    try {
        let { name, address, phone, password } = req.body
        if (!name || !address || !phone) {
            return res.staus(200).send({ message: "All fileld required *", success: false })
        }
        else {
            let findData = await usersModel.find({ _id: req.user._id })
            if (findData) {
                let newPassword = password ? await encryptPassword(password) : findData.password;
                let updateData = await usersModel.findByIdAndUpdate({ _id: req.user._id }, { ...req.body, password: newPassword }, { new: true })
                res.status(200).send({ message: "Profile is Updated successful", success: true, user: updateData })
            }
            else {
                return res.status(500).send({ success: false, message: "somthing wrong" })
            }
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: "Somthing wrong while updating", err, success: false })
    }
}
