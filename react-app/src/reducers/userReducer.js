export const createUserReducer = (loggedIn, accessToken) => {
  return (state = { loggedIn: loggedIn, accessToken: accessToken }, action) => {
    switch (action.type) {
      case "LOGOUT":
        window.localStorage.removeItem('access_token');
        return { loggedIn: false };
      case "REDIRECT_TO_AUTH_SERVER":
        // Jump off, remember where to get the profile from.
        window.localStorage.setItem("profileUrl", action.profileUrl);
        window.location = action.url;
        return state;
      case "ME_FETCHING":
        return Object.assign({}, state, { meFetching: true });
      case "ME_FETCHED":
        return Object.assign({}, state, action.me, { meFetching: false });
      case "ME_FETCH_ERROR":
        // Most probable case: access token invalid
        window.localStorage.removeItem('access_token');
        return { loggedIn: false };
      case "PROFILE_FETCHING":
        return Object.assign({}, state, { fetchingProfile: true });
      case "PROFILE_FETCHED": {
        const userData = {
          name: action.profile.full_name,
          email: action.profile.email,
          username: action.profile.username
        };
        return Object.assign({}, state, userData, { fetchingProfile: false });
      }
      case "PROFILE_FETCH_ERROR":
        // You could do ... stuff here.
        return Object.assign({}, state, { fetchingProfile: false });
      case "USER_USERNAME":
        return Object.assign({}, state, { username: action.username });
      case "USER_DISPLAYNAME":
        return Object.assign({}, state, { name: action.displayName });
      case "USER_EMAIL":
        return Object.assign({}, state, { email: action.email });
      case "USER_COMPANY":
        return Object.assign({}, state, { company: action.company });
      case "USER_ACCEPT_TERMS":
        return Object.assign({}, state, { acceptTerms: action.acceptTerms });
      case "USER_REGISTERING":
        return Object.assign({}, state, { registering: true });
      case "USER_REGISTERED":
        return Object.assign({}, state, action.user, { registering: false });
      case "VIEW_PROFILE":
        return Object.assign({}, state, { saveError: false });
      case "USER_SAVING":
        return Object.assign({}, state, { saving: true, saveError: false });
      case "USER_SAVED":
        return Object.assign({}, state, action.user, { saving: false });
      case "USER_SAVE_ERROR":
        return Object.assign({}, state, { saving: false, saveError: true });
      default:
        return state;
    }
  };
};