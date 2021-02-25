import { createStore, combineReducers} from 'redux'
//import thunk from 'redux-thunk';
import authReducer from '../reducers/auth'
import userDondetails from '../reducers/userDonationDetails'
import mrchEventList from '../reducers/mrchEventList'
import mrchEventUsrDetails from '../reducers/mrchEventUsrList'

//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__COMPOSE__ || compose;
//const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      userDondetails: userDondetails,
      mrchEventList: mrchEventList,
      mrchEventUsrDetails: mrchEventUsrDetails
    }),
    //composeEnhancers(applyMiddleware(thunk))
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};