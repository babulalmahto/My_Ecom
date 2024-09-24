import express from 'express'
import { loginController, profileUpdateController, registerController, resetPasswordHandler } from '../controller/authController.js';
import { isAdmin, isRequire } from '../middleware/authMiddleware.js';

const route = express.Router();;

route.post('/register', registerController);
route.post('/login', loginController);

route.get('/auth-user', isRequire, (req, res) => {
    res.send({ ok: true })
})


route.get("/admin-auth-route", isRequire, isAdmin, (req, res) => {
    res.send({ ok: true })
})


route.post('/reset-password', resetPasswordHandler);

route.put('/profile-update', isRequire, profileUpdateController);


export default route;