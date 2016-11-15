'use strict';

const async = require('async');
const crypto = require('crypto');
const debug = require('debug')('markdown-notes-api:db');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const db = function () { };

let _dataPath = path.join(__dirname, '..', 'data');
if (process.env.API_DATAPATH) {
    _dataPath = process.env.API_DATAPATH;
    console.log('Picking up data storage path from API_DATAPATH: ' + _dataPath);
} else {
    console.log('Using default data storage path: ' + _dataPath);
    console.log('Override with environment variable API_DATAPATH.');
}

let _dbPath = null;
const getPath = () => {
    if (!_dbPath) {
        const dbPath = _dataPath;
        if (!fs.existsSync(dbPath)) {
            debug('Creating db path: ' + dbPath);
            fs.mkdirSync(dbPath);
        }
        _dbPath = dbPath;
    }
    return _dbPath;
};

let _userPath = null;
const getUserPath = () => {
    if (!_userPath) {
        const dbPath = getPath();
        const userPath = path.join(dbPath, 'users');
        if (!fs.existsSync(userPath)) {
            debug('Creating user data path: ' + userPath);
            fs.mkdirSync(userPath);
        }
        _userPath = userPath;
    }
    return _userPath;
};

let _notesPath = null;
const getNotesPath = () => {
    if (!_notesPath) {
        const dbPath = getPath();
        const notesPath = path.join(dbPath, 'notes');
        if (!fs.existsSync(notesPath)) {
            debug('Creating notes data path: ' + notesPath);
            fs.mkdirSync(notesPath);
        }
        _notesPath = notesPath;
    }
    return _notesPath;
};

const getUserFile = (userId) => {
    if (!userId)
        throw new Error('getUserFile: No userId passed.');
    return path.join(getUserPath(), userId + '.json');
};

const getUserIndexFile = (userId) => {
    if (!userId)
        throw new Error('getUserIndexFile: No userId passed.');
    return path.join(getUserPath(), userId + '.index.json');
};

const getNoteFile = (noteId) => {
    if (!noteId)
        throw new Error('getNoteFile: No noteId passed.');
    return path.join(getNotesPath(), noteId + '.json');
};

db.findOrCreateUser = (externalId, callback) => {
    debug('findOrCreateUser() ' + externalId);
    // Deduce the internal user id from external ID; this is probably not a good
    // idea, but otherwise I'd have to map via some lookup. Too lazy.
    const userId = getUserId(externalId);
    async.waterfall([
        (callback) => db.userExists(userId, callback),
        (userExists, callback) => {
            if (userExists)
                db.readUser(userId, callback);
            else
                db.createUser(userId, externalId, callback);
        }
    ], callback); // callback is (err, userData)
};

db.userExists = (userId, callback) => {
    debug('userExists() ' + userId);
    const userFile = getUserFile(userId);
    return callback(null, fs.existsSync(userFile));
};

db.readUser = (userId, callback) => {
    debug('readUser() ' + userId);
    const userFile = getUserFile(userId);
    fs.readFile(userFile, 'utf8', function (err, data) {
        if (err)
            return callback(err);
        return callback(null, JSON.parse(data));
    });
};

db.createUser = (userId, externalId, callback) => {
    debug('createUser() ' + userId + ' (external ' + externalId + ')');
    const now = Date.now();
    const newUserData = {
        registered: false,
        id: userId,
        external_id: externalId,
        created_date: now,
        updated_date: now
    };
    const userFile = getUserFile(userId);
    const userIndexFile = getUserIndexFile(userId);
    async.parallel([
        (callback) => fs.writeFile(userFile, JSON.stringify(newUserData, null, 2), 'utf8', callback),
        (callback) => fs.writeFile(userIndexFile, JSON.stringify([]), 'utf8', callback)
    ], (err, results) => {
        if (err)
            return callback(err);
        return callback(null, newUserData);
    });
};

db.writeUser = (userId, userData, callback) => {
    debug('writeUser() ' + userId);
    async.waterfall([
        (callback) => db.userExists(userId, callback),
        (userExists, callback) => {
            if (!userExists)
                return callback(new Error('Cannot write to a user which does not yet exist. Must be created first.'));
            return db.readUser(userId, callback);
        },
        (previousData, callback) => {
            // Take out changeable data
            let {
                registered,
                username,
                name,
                email,
                company
            } = userData;
            if (registered && typeof (registered) === 'string') {
                if (registered === 'true' || registered === 'True' || registered === '1')
                    registered = true;
                else
                    registered = false;
            }
            const updateData = {
                registered: registered,
                username: username,
                name: name,
                email: email,
                company: company,
                updated_date: Date.now()
            };
            const newData = Object.assign(previousData, updateData);
            fs.writeFile(getUserFile(userId), JSON.stringify(newData, null, 2), 'utf8', (err) => callback(err, newData));
        }
    ], callback);
};

const getUserId = (externalId) => {
    const hash = crypto.createHash('sha256');
    hash.update(externalId);
    return hash.digest('hex');
};

db.noteExists = (noteId, callback) => {
    debug('noteExists() ' + noteId);
    const noteFile = getNoteFile(noteId);
    if (fs.existsSync(noteFile))
        callback(null, true);
    else
        callback(null, false);
};

db.readNote = (noteId, callback) => {
    debug('readNote() ' + noteId);
    const noteFile = getNoteFile(noteId);
    if (!fs.existsSync(noteFile))
        return callback(null, null);
    fs.readFile(noteFile, 'utf8', (err, data) => {
        if (err)
            return callback(err);
        return callback(null, JSON.parse(data));
    });
};

db.writeNote = (noteId, noteData, userId, callback) => {
    debug('writeNote() ' + noteId + ', userId: ' + userId);
    const noteFile = getNoteFile(noteId);
    async.waterfall([
        // Does this already exist?
        (callback) => db.noteExists(noteId, callback),
        (noteExists, callback) => {
            debug('Note exists: ' + noteExists);
            if (noteExists)
                return db.readNote(noteId, callback);
            return callback(null, {});
        },
        // Update and save
        (previousData, callback) => {
            debug('previousData:');
            debug(previousData);
            let currentNote = previousData;
            const now = Date.now();
            if (!currentNote || !currentNote.title) {
                debug('Creating new note.');
                // Create case
                currentNote = {
                    id: noteId,
                    owner: userId,
                    created_date: now,
                    created_by: userId
                };
            } else {
                debug('Updating note.');
            }
            // Title and Markdown can be changed
            debug(noteData);
            const {
                title,
                markdown
            } = noteData;
            const updateData = {
                title: title,
                markdown: markdown,
                updated_date: now,
                updated_by: userId
            };

            const newData = Object.assign(currentNote, updateData);
            debug(newData);
            fs.writeFile(noteFile, JSON.stringify(newData, null, 2), 'utf8', (err) => callback(err, newData));
        },
        // Fix index; this is not immediate, but is eventually done.
        (newData, callback) => upsertUserIndex(userId, newData, (err) => callback(err, newData))
    ], callback);
};

db.deleteNote = (noteId, userId, callback) => {
    debug('deleteNote() ' + noteId);
    const noteFile = getNoteFile(noteId);
    async.waterfall([
        (callback) => db.noteExists(noteId, callback),
        (noteExists, callback) => {
            if (noteExists) {
                fs.unlink(noteFile, (err) => callback(err, true));
            } else {
                callback(null, false);
            }
        },
        // Delete from user index; this is not immediate, but is eventually done.
        (hasDeleted, callback) => {
            if (hasDeleted)
                deleteNoteFromUserIndex(userId, noteId, (err) => callback(err, true));
            else
                callback(null, false);
        }
    ], callback);
};

db.readUserIndex = (userId, callback) => {
    debug('readUserIndex() ' + userId);
    const userIndex = loadUserIndexSync(userId);
    callback(null, userIndex);
};

const loadUserIndexSync = (userId) => {
    debug('loadUserIndexSync() ' + userId);
    const indexFile = getUserIndexFile(userId);
    return JSON.parse(fs.readFileSync(indexFile, 'utf8'));
};

const saveUserIndexSync = (userId, userIndex) => {
    debug('saveUserIndexSync() ' + userId);
    const indexFile = getUserIndexFile(userId);
    fs.writeFileSync(indexFile, JSON.stringify(userIndex, null, 2), 'utf8');
};

const _indexActions = [];

const upsertUserIndex = (userId, noteData, callback) => {
    debug('upsertUserIndex()');
    _indexActions.push({
        type: 'UPSERT',
        userId,
        noteData
    });
    setTimeout(callback, 0);
};

const doUpsertUserIndexSync = (userId, noteData) => {
    debug('doUpsertUserIndexSync()');
    const userIndex = loadUserIndexSync(userId);
    const index = _.findIndex(userIndex, e => e.id == noteData.id);
    if (index < 0) {
        // Insert
        userIndex.push({
            id: noteData.id,
            title: noteData.title
        });
    } else {
        // Update
        userIndex[index].title = noteData.title;
    }
    saveUserIndexSync(userId, userIndex);
};

const deleteNoteFromUserIndex = (userId, noteId, callback) => {
    _indexActions.push({
        type: 'DELETE',
        userId,
        noteId
    });
    setTimeout(callback, 0);
};

const doDeleteNoteFromUserIndexSync = (userId, noteId) => {
    debug('doDeleteNoteFromUserIndexSync() user: ' + userId + ', note: ' + noteId);
    const userIndex = loadUserIndexSync(userId);
    const index = _.findIndex(userIndex, e => e.id === noteId);
    if (index < 0) {
        console.error('Could not find note id ' + noteId + ' in index of user ' + userId + '. Data seems to be corrupt.');
        return;
    }
    userIndex.splice(index, 1);
    saveUserIndexSync(userId, userIndex);
};

// Handle with care. Or, rather, don't use. This is for unit testing.
db.flushIndexActions = (callback) => {
    debug('flushIndexActions()');
    checkIndexActions();
    setTimeout(callback, 0);
};

const checkIndexActions = () => {
    if (_indexActions.length === 0)
        return; // Nothing to do
    debug('checkIndexActions(), count = ' + _indexActions.length);
    for (let i = 0; i < _indexActions.length; ++i) {
        try {
            const action = _indexActions[i];
            debug(action);
            switch (action.type) {
                case 'UPSERT':
                    doUpsertUserIndexSync(action.userId, action.noteData);
                    break;
                case 'DELETE':
                    doDeleteNoteFromUserIndexSync(action.userId, action.noteId);
                    break;
                default:
                    console.error('checkIndexActions: Unknown action type "' + action.type + '".');
                    break;
            }
        } catch (ex) {
            console.error(ex);
            console.error(ex.stack);
        }
    }
    _indexActions.length = 0; // This deletes all entries in the array, which is what we want
};

setInterval(checkIndexActions, 500);

module.exports = db;