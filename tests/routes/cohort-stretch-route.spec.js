const request = require('supertest')
const app = require('../../server/app')
const {
  models: { CohortStretch }
} = require('../../server/db/index')
const db = require('../../server/db/db')
const syncAndSeed = require('../../bin/seed')

describe('cohort-stretch routes', () => {
  beforeAll(async () => {
    await syncAndSeed()
  })
  afterAll(async () => {
    await db.close()
    done()
  })
  describe('/api/cohort-stretches', () => {
    test('it returns all cohort stretches, excluding status', done => {
      request(app)
        .get('/api/cohort-stretches')
        .then(res => {
          expect(res.status).toBe(200)
          return done()
        })
        .catch(err => done(err))
    })
  })
})
