/* eslint-disable complexity */
import Socket from './Socket'
import { GET_USER_DETAILS, LOGOUT } from '../auth/actions'
import { CREATE_COMMENT } from '../comments/actions'
import { START_STRETCH_TIMER } from '../cohort-stretches/actions'
import {
  CREATE_STRETCH_ANSWER,
  UPDATE_STRETCH_ANSWER
} from '../stretch-answers/actions'
import { CREATE_STRETCH } from '../stretches/actions'

const socketMiddleware = storeAPI => {
  let socket
  return next => action => {
    switch (action.type) {
      case GET_USER_DETAILS:
        socket = new Socket(action.userDetails, storeAPI)
        break
      case CREATE_COMMENT:
        socket.sendMessage(action.newComment, action.emitObject)
        break
      case LOGOUT:
        socket.disconnectUser()
        break
      case START_STRETCH_TIMER:
        socket.startStretchTimer(action.cohortStretch)
        break
      case CREATE_STRETCH_ANSWER:
        socket.sendStretchAnswer(action.newStretchAnswer, action.adminIds)
        break
      case UPDATE_STRETCH_ANSWER:
        if (action.emit) {
          socket.sendAnswerRating(action.updatedStretchAnswer)
        }
        break
      case CREATE_STRETCH:
        if (action.emit) {
          socket.sendNewStretch(action.newStretch)
        }
        break
      default:
        break
    }

    return next(action)
  }
}

export default socketMiddleware
