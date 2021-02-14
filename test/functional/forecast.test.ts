import supertest from 'supertest'

describe('beach forecast funtions tests', () => {
  it('should return a forecast with just a few times', async() => {
    const {body, status} = await supertest(app).get('/forecast')

    expect(status).toBe(200)
    expect(body).toBe([{

    }])
  })
})
