const router = require('express').Router()
const {
  models: { Stretch }
} = require('../db/index')

// GET, retrieves all stretches from the database
router.get('/', (req, res, next) => {
  Stretch.getAllStretches()
    .then(stretches => res.json(stretches))
    .catch(next)
})

module.exports = router