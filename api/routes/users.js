'use strict';

const debug = require('debug')('markdown-notes-api:users');
const express = require('express');
const router = express.Router();

const db = require('./db');

router.get('/me', (req, res, next) => {
    debug('/me');
    res.json(req.user);
});

router.get('/:userId', (req, res, next) => {
    // Currently, you can only get yourself
    const userId = req.params.userId;
    if (req.user.id !== userId)
        res.status(403).json({ message: 'Not allowed' });
    db.readUser(userId, (err, userData) => {
        if (err)
            return next(err);
        res.json(userData);
    });
});

router.put('/:userId', (req, res, next) => {
    // Currently, you can only PUT yourself
    const userId = req.params.userId;
    if (req.user.id !== userId)
        res.status(403).json({ message: 'Not allowed' });
    const dataToUpdate = req.body;
    db.writeUser(userId, dataToUpdate, (err, userData) => {
        if (err)
            return next(err);
        res.json(userData);
    });
});

router.get('/:userId/index', (req, res, next) => {
    const userId = req.params.userId;
    if (req.user.id !== userId)
        res.status(403).json({ message: 'Not allowed' });
    db.readUserIndex(userId, (err, userIndex) => {
        if (err)
            return next(err);
        res.json(userIndex);
    });
});

module.exports = router;
