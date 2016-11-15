import api from './api';

// ================================================
//               PLAIN ACTIONS
// ================================================

export const logoutUser = function () {
  return {
    type: "LOGOUT"
  };
};

export const viewProfile = function () {
  return {
    type: "VIEW_PROFILE"
  };
};

export const viewEditor = function () {
  return {
    type: "VIEW_EDITOR"
  };
};

export const addNote = function () {
  return {
    type: "ADD_NOTE"
  };
};

export const noteDeleted = function (id) {
  return {
    type: "NOTE_DELETED",
    id
  };
};

export const selectNote = function (id) {
  return {
    type: "SELECT_NOTE",
    id
  };
};

export const saveNoteSaving = function (id) {
  return {
    type: "SAVE_NOTE_SAVING",
    id
  };
};

export const saveNoteSaved = function (id) {
  return {
    type: "SAVE_NOTE_SAVED",
    id
  };
};

export const noteLoaded = function (note) {
  return {
    type: "NOTE_LOADED",
    note
  };
};

export const noteLoadError = function (error, id) {
  return {
    type: "NOTE_LOAD_ERROR",
    error,
    id
  };
};

export const changeTitle = function (id, title) {
  return {
    type: "CHANGE_TITLE",
    id,
    title
  };
};

export const changeMarkdown = function (id, markdown) {
  return {
    type: "CHANGE_MARKDOWN",
    id,
    markdown
  };
};

export const redirectToAuthServer = function (url, profileUrl) {
  return {
    type: "REDIRECT_TO_AUTH_SERVER",
    url: url,
    profileUrl: profileUrl,
  };
};

export const meFetching = function () {
  return {
    type: "ME_FETCHING"
  };
};

export const meFetched = function (user) {
  return {
    type: "ME_FETCHED",
    me: user
  };
};

export const meFetchError = function (err) {
  return {
    type: "ME_FETCH_ERROR",
    error: err
  };
};

export const profileFetching = function () {
  return {
    type: "PROFILE_FETCHING"
  };
};

export const profileFetched = function (profile) {
  return {
    type: "PROFILE_FETCHED",
    profile
  };
};

export const profileFetchError = function (err) {
  return {
    type: "PROFILE_FETCH_ERROR",
    error: err
  };
};

export const changeUsername = function (username) {
  return {
    type: "USER_USERNAME",
    username
  };
};

export const changeEmail = function (email) {
  return {
    type: "USER_EMAIL",
    email
  };
};

export const changeDisplayName = function (displayName) {
  return {
    type: "USER_DISPLAYNAME",
    displayName
  };
};

export const changeCompany = function (company) {
  return {
    type: "USER_COMPANY",
    company
  };
};

export const registeringUser = function () {
  return {
    type: "USER_REGISTERING"
  };
};

export const registeredUser = function (user) {
  return {
    type: "USER_REGISTERED",
    user
  };
};

export const registerFailed = function (err) {
  return {
    type: "USER_REGISTER_FAILED",
    error: err
  };
};

export const indexLoaded = function (notesIndex) {
  console.log(notesIndex);
  return {
    type: "INDEX_LOADED",
    notesIndex
  };
};

export const changeAcceptTerms = function (acceptTerms) {
  console.log('changeAcceptTerms: ' + acceptTerms);
  let booleanTerms = false;
  if (acceptTerms === true || acceptTerms === 'true' || acceptTerms === 'on')
    booleanTerms = true;
  return {
    type: "USER_ACCEPT_TERMS",
    acceptTerms: booleanTerms
  };
};

export const indexLoadError = function (error) {
  console.error(error);
  console.error(error.stack);
};

export const userSaving = function () {
  return {
    type: "USER_SAVING"    
  };
};

export const userSaved = function (userData) {
  return {
    type: "USER_SAVED",
    user: userData
  };
};

export const userSaveError = function (error) {
  return {
    type: "USER_SAVE_ERROR",
    error
  };
};

// ================================================
// ASYNC ACTIONS - these need redux-thunk to work.
// ================================================

export const saveNote = function (id) {
  return (dispatch, getState) => {
    const state = getState();
    if (state.notes[id].dirty && !state.notes[id].loadError) {
      dispatch(saveNoteSaving(id));
      api.putNote(state, state.notes[id])
        .then(dispatch(saveNoteSaved(id)));
    }
  };
};

export const switchNote = function (id) {
  return function (dispatch, getState) {
    const state = getState();
    const previousId = state.activeId;
    if (previousId) {
      dispatch(saveNote(previousId));
    }
    const nextNote = state.notes[id];
    if (!nextNote.needsFetch) {
      dispatch(selectNote(id));
    } else {
      api.getNote(state, id)
        .then((note) => {
          dispatch(noteLoaded(note));
          dispatch(selectNote(id));
        }).catch((error) => dispatch(noteLoadError(error)));
    }
  };
};

export const registerUser = function () {
  return (dispatch, getState) => {
    dispatch(registeringUser());
    const userData = Object.assign({}, getState().user);
    console.log(userData);
    userData.registered = true;
    api.putUser(getState(), userData)
      .then((data) => dispatch(registeredUser(data)))
      .catch((err) => dispatch(registerFailed(err)));
  };
};

export const deleteNote = function (id) {
  return (dispatch, getState) => {
    // This is not quite correct, but let's do this synchronuously:
    dispatch(noteDeleted(id));
    // And then delete it via api
    api.deleteNote(getState(), id)
      .then(() => {})
      .catch((err) => { console.error(err); });
  };
};

export const saveUser = function () {
  return (dispatch, getState) => {
    dispatch(userSaving());
    const state = getState();
    api.putUser(state, state.user)
      .then((userData) => dispatch(userSaved(userData)))
      .catch((error) => dispatch(userSaveError(error)));
  };
};

// This needs redux-thunk to work
export const initializeFromApi = function () {
  return function (dispatch, getState) {
    dispatch(meFetching());
    api.getMe(getState()).then((data) => {
      console.log("/users/me:");
      console.log(data);
      dispatch(meFetched(data));
      if (!data.registered) {
        // Prefill user profile with data from IdP
        api.getProfile(getState()).then((profile) => {
          console.log("Profile:");
          console.log(profile);
          dispatch(profileFetched(profile));
        }).catch((err) => {
          dispatch(profileFetchError(err));
        });
      } else {
        // Load index
        api.getUserIndex(getState(), data.id)
          .then((userIndex) => dispatch(indexLoaded(userIndex)))
          .catch((error) => dispatch(indexLoadError(error)));
      }
    }).catch((err) => {
      dispatch(meFetchError(err));
    });
  };
};
