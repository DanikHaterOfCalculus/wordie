const express = require('express');

const { protect, admin } = require('../middlewares/auth'); 
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    saveQuizResult, 
    getAllUsers, 
    updateUser, 
    deleteUser,
    updateUserProfile
} = require('../controllers/userController'); 
const { validateRegistration, validateLogin, validateProfileUpdate } = require('../middlewares/validate');
const router = express.Router();
router.put('/profile', protect, validateProfileUpdate, updateUserProfile);
router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/saveQuizResult', protect, saveQuizResult);
router.get('/all-users', protect, admin, getAllUsers);
router.put('/update/:id', protect, admin, updateUser);  
router.delete('/delete/:id', protect, admin, deleteUser);  
module.exports = router;
    