const { Cohort, User, CohortUser, Attendance } = require('../models')

Cohort.getCohortsOfSingleAdmin = function(adminId) {
  return Cohort.findAll({
    include: [{ model: CohortUser, attributes: [], where: { userId: adminId } }]
  })
}
