export const createAuthServersReducer = () => {
  return (state = [], action) => {
    switch (action.type) {
      case "SETTINGS_LOADED":
        return action.settings.authServers;
      default:
        return state;
    }
  };
};
