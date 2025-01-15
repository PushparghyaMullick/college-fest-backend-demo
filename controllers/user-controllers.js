const User = require('../models/user');
const generateToken = require('../utils/generate-token');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, role } = req.body;
    let identifiedUser;
    try {
        identifiedUser = await User.findOne({ email });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (identifiedUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    const user = new User({ name, email, password: hashedPassword, role, events: [] });
    try {
        await user.save();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    generateToken(user._id, user.role, res);
    res.status(201).json({ message: 'User created successfully' });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    let identifiedUser;
    try {
        identifiedUser = await User.findOne({ email });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!identifiedUser) {
        return res.status(400).json({ message: 'User not found' });
    }
    let isPasswordCorrect = false;
    try {
        isPasswordCorrect = await bcrypt.compare(password, identifiedUser.password);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    generateToken(identifiedUser._id, identifiedUser.role, res);
    res.status(200).json({ message: 'Login successful' });
}

const addStudent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    let identifiedUser;
    try {
        identifiedUser = await User.findOne({ email });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (identifiedUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    let hashedPassword; 
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    const user = new User({ name, email, password: hashedPassword, role: 'student', events: [] });
    try {
        await user.save();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(201).json({ message: 'Student added successfully' });
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const role = req.userRole;
    if (role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    let user;
    try {
        user = await User.findById(id);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        await user.deleteOne();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
}

const getUserDetails = async (req, res) => {
    const { id } = req.params;
    const role = req.userRole;
    const userId = req.userId;
    if (role !== 'admin' && userId !== id) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    let user;
    try {
        user = await User.findById(id);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user: { name: user.name, email: user.email, role: user.role, events: user.events } });
}

module.exports = { signup, login, addStudent, deleteUser, getUserDetails };