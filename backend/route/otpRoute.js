import express from 'express'
const otpRoute = express.Router()

// this is for the otp generation
otpRoute.post('/otp', otpGenrateHandler)

// this is for the otp validation
otpRoute.post('/otp-validate', otpValiateHandler)


export default otpRoute