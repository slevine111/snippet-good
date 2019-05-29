import { GET_CATEGORIES } from './actions'

export default (state = [], action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return [...action.categories]

    default:
      return state
  }
}
