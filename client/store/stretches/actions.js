import axios from 'axios'

// --------------------------------------------------
// Action types

export const GET_STRETCHES = 'GET_STRETCHES'
export const CREATE_STRETCH = 'CREATE_STRETCH'
export const UPDATE_STRETCH = 'UPDATE_STRETCH'
export const DELETE_STRETCH = 'DELETE_STRETCH'

// --------------------------------------------------
// Action creators

const getStretches = stretches => ({ type: GET_STRETCHES, stretches })
const addStretch = newStretch => ({ type: CREATE_STRETCH, newStretch })
const replaceStretch = updatedStretch => ({
  type: UPDATE_STRETCH,
  updatedStretch
})
const removeStretch = stretchId => ({ type: DELETE_STRETCH, stretchId })

// --------------------------------------------------
// CRUD thunks

// Redux thunk to get all users from API
export const getAllStretches = () => dispatch => {
  return axios
    .get('/api/stretches')
    .then(res => dispatch(getStretches(res.data)))
}

export const createStretch = newStretch => dispatch => {
  return axios
    .post('/api/stretches', newStretch)
    .then(res => console.log(res.data))
}
