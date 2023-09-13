import { combineReducers } from 'redux'

import UserDataChange from './FrontendReducers/UserReducers'
import FormDataChange from './FrontendReducers/FormReducer'




const rootReducer = combineReducers({
    UserDataChange,
    FormDataChange
})

export default rootReducer

