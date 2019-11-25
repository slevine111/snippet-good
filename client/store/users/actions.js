import axios from 'axios'

// --------------------------------------------------
// Action types

export const GET_USERS = 'GET_USERS'

// --------------------------------------------------
// Action creators

const getUsers = users => ({ type: GET_USERS, users })

// --------------------------------------------------
// CRUD thunks

// Redux thunk to get all users from API
export const getAllUsers = () => dispatch => {
  return axios.get('/api/users').then(res => dispatch(getUsers(res.data)))
}

export const getUsersOfSingleAdminThunk = adminId => {
  return dispatch => {
    return axios
      .get(`/api/users/admin/${adminId}`)
      .then(res => dispatch(getUsers(res.data)))
  }
}
