const express = require('express');
const { registerController, loginController, resetPasswordController } = require('../controller/auth.controller');

const authRouter = express.Router();;

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.post('/reset-password', resetPasswordController)


module.exports = authRouter;