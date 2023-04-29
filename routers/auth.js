const express = require('express');
const { verifyAccessToken, verifyRefreshToken, verifyResetToken }= require('../middlewares/verifyToken');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', verifyAccessToken, authController.confirm)
router.put('/', verifyAccessToken, authController.updateInfor)
    
router.put('/password', verifyAccessToken, authController.changePassword)
router.post('/forget-password', authController.forgetPassword)
router.put('/reset-password/:resetToken', verifyResetToken, authController.resetPassword)

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/token', verifyRefreshToken, authController.getAccessToken)
router.get('/logout', verifyAccessToken, authController.logout)

module.exports = router;