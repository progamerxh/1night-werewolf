import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase'
import {users} from '../reducer/userReducer'

export default combineReducers({
    firebase: firebaseReducer,
    users: users,
  });