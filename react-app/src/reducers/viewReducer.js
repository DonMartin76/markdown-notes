export const createViewReducer = () => {
  return (state = "EDITOR", action) => {
    switch (action.type) {
      case "VIEW_PROFILE":
        return "PROFILE";
      case "USER_SAVED":
      case "VIEW_EDITOR":
        return "EDITOR";
      default:
        return state;
    }
  };
};