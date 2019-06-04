const { Op } = require('sequelize')
const { User, CohortUser, StretchAnswer } = require('../models')

const getAnswersOfStudentsOfSingleAdmin = function(adminId) {
  return User.findOne({
    where: { id: adminId },
    include: CohortUser
  })
    .then(user => user.cohortusers.map(cu => cu.cohortId))
    .then(cohortIds => {
      return StretchAnswer.findAll({
        include: [
          {
            model: CohortUser,
            attributes: ['cohortId'],
            where: { cohortId: { [Op.in]: cohortIds } }
          }
        ]
      })
    })
    .then(stretchAnswers => {
      return stretchAnswers.map(s => {
        const values = s.get()
        const {
          cohortuser: { cohortId },
          ...itemValues
        } = values
        return {
          ...itemValues,
          cohortId
        }
      })
    })
}

module.exports = { getAnswersOfStudentsOfSingleAdmin }