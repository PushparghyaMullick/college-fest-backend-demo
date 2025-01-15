const express = require('express');
const router = express.Router();
const { getEvents, addEvent, updateEvent, deleteEvent, participate } = require('../controllers/event-controllers');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);
router.get('/', getEvents);
router.post('/add', [
    check('name').notEmpty().withMessage('Name is required')
], addEvent);
router.put('/update/:id', [
    check('name').notEmpty().withMessage('Name is required')
], updateEvent);
router.delete('/delete/:id', deleteEvent);
router.post('/participate/:id', participate);

module.exports = router;