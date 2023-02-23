import { createStore } from "redux";

const initialState = {
  history: localStorage.getItem("conversionHistory")
    ? JSON.parse(localStorage.getItem("conversionHistory")).history
    : [],
};

function rootReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case "ADD":
      newState = {
        ...state,
        history: [action.data, ...state.history],
      };
      break;
    case "DELETE":
      const newHistory = [...state.history];
      newHistory.splice(action.index, 1);
      newState = {
        ...state,
        history: newHistory,
      };
      break;
    default:
      newState = state;
      break;
  }

  localStorage.setItem("conversionHistory", JSON.stringify(newState));
  return newState;
}

const store = createStore(rootReducer);

export default store;
