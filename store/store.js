import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./root";

const loggerMiddleware = createLogger();

export default () => {
  return createStore(
    rootReducer,
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware,
      )
  );
};