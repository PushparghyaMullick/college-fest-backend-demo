const express = require('express');
const router = express.Router();
const { signup, login, addStudent, deleteUser, getUserDetails } = require('../controllers/user-controllers');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').normalizeEmail().isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    check('role').isIn(['student', 'manager', 'admin']).withMessage('Invalid role')
], signup);
router.post('/login', [
    check('email').normalizeEmail().isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], login);
router.use(checkAuth);
router.post('/add', [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').normalizeEmail().isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], addStudent);
router.delete('/delete/:id', deleteUser);   
router.get('/details/:id', getUserDetails);

module.exports = router;