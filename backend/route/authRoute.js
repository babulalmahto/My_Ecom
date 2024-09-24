import express from 'express'
import { findAllUserContorlller, loginController, profileUpdateController, registerController, resetPasswordHandler, updateContorller, userRoleContorller } from '../controller/authController.js';
import { isAdmin, isRequire } from '../middleware/authMiddleware.js';

const route = express.Router();;

route.post('/register', registerController);
route.post('/login', loginController);

route.get('/auth-user', isRequire, (req, res) => {
    res.send({ ok: true })
})

route.post('/reset-password', resetPasswordHandler);


route.get("/admin-auth-route", isRequire, isAdmin, (req, res) => {
    res.send({ ok: true })
})

//update user || put
route.put('/profile-update', isRequire, profileUpdateController);

route.get('/all-users', findAllUserContorlller)

// user role update || post
route.post('/user-role', userRoleContorller)

// user Data update || Put
route.put('//user-update', updateContorller);



export default route;