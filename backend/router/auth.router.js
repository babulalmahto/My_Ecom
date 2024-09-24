const express = require('express');
const { registerController, loginController, resetPasswordController } = require('../controller/auth.controller');
const {isRequire, isAdmin} = require('../middleware/auth.middleware');

const authRouter = express.Router();;

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);

authRouter.get('/auth-user', isRequire, (req, res) => {
    res.send({ ok: true })
})
authRouter.post('/reset-password', resetPasswordController);


authRouter.get("/admin-auth-route", isAdmin, (req, res) => {
    res.send({ ok: true })
})


module.exports = authRouter;