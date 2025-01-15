const Event = require('../models/event');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const mongoose = require('mongoose');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ events });
}

const addEvent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const role = req.userRole;
    if (role !== 'manager' && role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const { name } = req.body;
    const event = new Event({ name, participants: [] });
    try {
        await event.save();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(201).json({ message: 'Event added successfully' });
}

const updateEvent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const role = req.userRole;
    if (role !== 'manager' && role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const { name } = req.body;
    let event;
    try {
        event = await Event.findById(id);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }
    event.name = name;
    try {
        await event.save();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'Event updated successfully' });
}

const deleteEvent = async (req, res) => {
    const role = req.userRole;
    if (role !== 'manager' && role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    let event;
    try {
        event = await Event.findById(id);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }
    try {
        await event.deleteOne();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    try {
        await User.updateMany({ events: id }, { $pull: { events: id } });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
}

const participate = async (req, res) => {
    const role = req.userRole;
    if (role !== 'student') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const eventId = req.params.id;
    let event;
    try {
        event = await Event.findById(eventId).populate('participants');
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }
    const userId = req.userId;
    let user;
    try {
        user = await User.findById(userId).populate('events');
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (user.events.includes(eventId)) {
        return res.status(400).json({ message: 'User already participated in this event' });
    }
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        event.participants.push(userId);
        user.events.push(eventId);
        await event.save({ session });
        await user.save({ session });
        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'Participated in event successfully' });
}

module.exports = { getEvents, addEvent, updateEvent, deleteEvent, participate };