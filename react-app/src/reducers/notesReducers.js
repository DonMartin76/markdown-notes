import _ from 'lodash';

function generateUUID() {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
  });
  return uuid;
}

let currentId = generateUUID();
export const createNotesIndexReducer = () => {
  return (state = [], action) => {
    switch (action.type) {
      case "INDEX_LOADED":
        return action.notesIndex;
      case "ADD_NOTE":
        currentId = generateUUID();
        return [
          ...state,
          {
            id: currentId,
            title: "New note"
          }
        ];
      case "NOTE_DELETED":
        return state.filter(note => note.id !== action.id);
      case "CHANGE_TITLE":
        const changeIndex = _.findIndex(state, n => n.id === action.id);
        return [
          ...state.slice(0, changeIndex),
          Object.assign({}, state[changeIndex], { title: action.title }),
          ...state.slice(changeIndex + 1)
        ];
      default:
        return state;
    }
  };
};

const updateNotes = (notes, id, updateData) => {
  const changedNote = Object.assign({}, notes[id], updateData);
  const partialState = {};
  partialState[id] = changedNote;
  return Object.assign({}, notes, partialState);
};

export const createNotesReducer = () => {
  return (state = {}, action) => {
    switch (action.type) {
      case "INDEX_LOADED": {
        const newNotes = {};
        for (let i = 0; i < action.notesIndex.length; ++i) {
          const thisNote = action.notesIndex[i];
          newNotes[thisNote.id] = {
            id: thisNote.id,
            title: thisNote.title,
            needsFetch: true
          };
        }
        return newNotes;
      }
      case "NOTE_LOADED":
        action.note.needsFetch = false;
        return updateNotes(state, action.note.id, action.note);
      case "NOTE_LOAD_ERROR":
        return updateNotes(state, action.id, { loadError: true });
      case "ADD_NOTE":
        const newNote = {};
        newNote[currentId] = {
          id: currentId,
          title: "New note",
          markdown: "# Write something\n\nLorem ipsum `code`...",
          dirty: true
        };
        return Object.assign(newNote, state);
      case "NOTE_DELETED":
        const newState = Object.assign({}, state);
        delete newState[action.id];
        return newState;
      case "CHANGE_TITLE": {
        return updateNotes(state, action.id, { title: action.title, dirty: true });
      }
      case "CHANGE_MARKDOWN": {
        return updateNotes(state, action.id, { markdown: action.markdown, dirty: true });
      }
      case "SAVE_NOTE_SAVING": {
        return updateNotes(state, action.id, { isSaving: true });
      }
      case "SAVE_NOTE_SAVED": {
        return updateNotes(state, action.id, { dirty: false, isSaving: false });
      }
      default:
        return state;
    }
  };
};