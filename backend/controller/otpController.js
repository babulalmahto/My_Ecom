import mailGenerator from "../config/mailgen";
import transporter from "../config/nodemailer";
import otpModel from "../model/otpModel";
import usersModel from "../model/usersModel";
import randomInt from "crypto";
import jwt from "jsonwebtoken"



export let otpGenrateHandler = async (req, res) => {
    try {
        let { email } = req.body;
        let existUser = await usersModel.findOne({ email });
        if (existUser) {
            let existingOtp = await otpModel.findOne({ email });
            if (existingOtp) {
                return res
                    .status(200)
                    .send({ message: "Wait for while", success: false });
            } else {
                let otp = randomInt(100000, 1000000);
                await new otpModel({ otp, email, user: existUser._id }).save();
                //mailgen
                let response = {
                    body: {
                        name: existUser.name,
                        intro: "This for the otp login",
                        table: {
                            data: [
                                {
                                    title: "For login otp",
                                    otp,
                                },
                            ],
                        },
                        outro: "Looking forward to do more business",
                    },
                };
                let mail = mailGenerator.generate(response);
                let message = {
                    from: process.env.USER_NAME,
                    to: existUser.email,
                    subject: "otp",
                    html: mail,
                };
                transporter
                    .sendMail(message)
                    .then(() => {
                        return res
                            .status(200)
                            .send({ message: "Otp received successfully ", success: true });
                    })
                    .catch((err) => {
                        return res
                            .status(500)
                            .send({ message: "Somthing wrong getting otp ", success: false, err });
                    });
            }
        } else {
            return res
                .status(500)
                .send({ message: "Invailid email", success: false });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Somthing wrong ", err, success: false });
    }
};


// this is for otp validation
export let otpValiateHandler = async (req, res) => {
    try {
        let { email, otp } = req.body;
        let verifyOtp = await otpModel.findOne({ otp }).populate("user");
        if (verifyOtp) {
            //token creation
            let token = await jwt.sign(
                { _id: verifyOtp.user.id },
                process.env.SECRET_KEY,
                {
                    expiresIn: "7d",
                }
            );
            return res.status(200).send({
                message: "login successfully",
                success: true,
                user: {
                    name: verifyOtp.user.name,
                    email: verifyOtp.user.email,
                    phone: verifyOtp.user.phone,
                    address: verifyOtp.user.address,
                    role: verifyOtp.user.role,
                },
                token,
            });
        } else {
            return res.status(200).send({ message: "Otp Incorrect", success: false });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Somthing wrong !", success: false, err });
    }
}