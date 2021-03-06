const db = require('./db')
const models = require('./models')

const { User, Comment, Attendance, Withdrawal } = models
const { Cohort, CohortUser, CohortStretch } = models
const { Category, Stretch, StretchAnswer } = models

require('./methods')

function initDb(force = false) {
  return db.authenticate().then(() => {
    // Sequelize associations
    // --------------------------

    // Many-to-Many between User and Cohort
    CohortUser.belongsTo(Cohort)
    Cohort.hasMany(CohortUser)
    CohortUser.belongsTo(User)
    User.hasMany(CohortUser)

    // Comment belongs to User
    Comment.belongsTo(User)
    User.hasMany(Comment)

    // StretchAnswer belongs to User
    StretchAnswer.belongsTo(User)
    User.hasMany(StretchAnswer)

    // Stretch belongs to User
    Stretch.belongsTo(User, { as: 'author' })
    User.hasMany(Stretch, { foreignKey: 'authorId' })

    // CohortStretch belongs to Cohort
    CohortStretch.belongsTo(Cohort)
    Cohort.hasMany(CohortStretch)

    // CohortStretch belongs to Stretch
    CohortStretch.belongsTo(Stretch)
    Stretch.hasMany(CohortStretch)

    // Stretch belongs to Category
    Stretch.belongsTo(Category)
    Category.hasMany(Stretch)

    //StretchAnswer belongs to CohortStretch
    StretchAnswer.belongsTo(CohortStretch)
    CohortStretch.hasMany(StretchAnswer)

    //Comment belongs to StretchAnswer
    Comment.belongsTo(StretchAnswer)
    StretchAnswer.hasMany(Comment)

    // -------------------------------------------------------
    /* Attendance-related relationships

       Attendance model is a join table that joins students to cohorts.
       Withdrawl model is a join table that joins students to cohorts.
    */
    Attendance.belongsTo(User)
    User.hasMany(Attendance)

    Attendance.belongsTo(Cohort)
    Cohort.hasMany(Attendance)

    Withdrawal.belongsTo(CohortUser)
    CohortUser.hasMany(Withdrawal)
    // -------------------------------------------------------

    return db.sync({ force })
  })
}

module.exports = { initDb, models }
