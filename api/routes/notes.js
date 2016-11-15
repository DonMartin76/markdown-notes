'use strict';

const debug = require('debug')('markdown-notes-api:notes');
const express = require('express');
const router = express.Router();

const db = require('./db');

router.get('/:noteId', (req, res, next) => {
    const noteId = req.params.noteId;
    const userId = req.user.id;
    debug('/' + noteId);
    db.readNote(noteId, (err, noteData) => {
        if (err)
            return next(err);
        if (!noteData)
            return res.status(404).json({ message: 'Not found' });
        if (noteData.owner !== userId)
            return res.status(403).json({ message: 'Not allowed. You can only read your own notes.' });
        res.json(noteData);
    });
});

router.put('/:noteId', (req, res, next) => {
    const noteId = req.params.noteId;
    const userId = req.user.id;
    if (!req.user.registered)
        res.status(400).json({ message: 'Bad request. Cannot write notes without registration.' });
    const noteData = req.body;
    if (!noteData.title)
        res.status(400).json({ message: 'Bad request. Property "title" is mandatory.' });
    if (!noteData.markdown)
        res.status(400).json({ message: 'Bad request. Property "markdown" is mandatory.' });
    db.noteExists(noteId, (err, noteExists) => {
        const writeNote = (noteId, noteData) => {
            db.writeNote(noteId, noteData, userId, (err, updatedData) => {
                if (err)
                    return next(err);
                return res.json(updatedData);
            });
        };
        if (err)
            return next(err);
        if (!noteExists) {
            return writeNote(noteId, noteData);
        } else {
            // Check that we don't overwrite things which are not allowed
            db.readNote(noteId, (err, previousData) => {
                if (err)
                    return next(err);
                if (previousData.owner !== userId)
                    return res.status(403).json({ message: 'Not allowed. Does not belong to user.' });
                return writeNote(noteId, noteData);
            });
        }
    });
});

router.delete('/:noteId', (req, res, next) => {
    const noteId = req.params.noteId;
    const userId = req.user.id;
    debug('/' + noteId);
    db.readNote(noteId, (err, noteData) => {
        if (err)
            return next(err);
        if (!noteData)
            return res.status(404).json({ message: 'Not found' });
        if (noteData.owner !== userId)
            return res.status(403).json({ message: 'Not allowed. You can only delete your own notes.' });
        db.deleteNote(noteId, userId, (err) => {
            if (err)
                return next(err);
            res.status(204).json({ message: 'Successfully deleted.' });
        });
    });
});

module.exports = router;
