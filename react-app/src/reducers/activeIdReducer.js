export const createActiveIdReducer = () => {
  return (state = '', action) => {
    switch (action.type) {
      case "SELECT_NOTE":
        return action.id;
      case "NOTE_DELETED":
        return "";
      default:
        return state;
    }
  };
};