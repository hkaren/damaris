import {combineReducers, createStore, Store} from "redux";
import customerReducer from "./CustomerReducer";
import configReducer from "./ConfigReducer";

const rootReducer = combineReducers<any>({
    userInfo: customerReducer,
    config: configReducer,
});

const store: Store = createStore(rootReducer);

export default store;

