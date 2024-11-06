import express from 'express';
import { getUserProfileController, loginController, logoutController, registerController, updatePasswordController, updateProfileController,  updateProfilePicController } from '../controllers/userController.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multer.js';

//router objects
const router = express.Router();

//routes
//register
router.post('/register',registerController);

//login
router.post('/login',loginController);

//profile
router.get('/profile', isAuth , getUserProfileController);

//logout 
router.get('/logout',isAuth,logoutController);

//update profile
router.put('/profile-update' ,isAuth ,updateProfileController);

//update password
router.put('/update-password',isAuth ,updatePasswordController);

//update profile pic
router.put('/update-picture',isAuth, singleUpload ,updateProfilePicController);


//export 
export default router;