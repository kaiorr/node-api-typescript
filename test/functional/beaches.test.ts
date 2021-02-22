import { Beach } from "@src/model/beach"

describe('Beaches functional tests', () => {
  beforeAll(async () => await Beach.deleteMany({}))
  describe('When creating a beach', () => {
    it('Should create a beach with sucess', async () => {
      const newBeach = {
          lat: -33.792726,
          lng: 151.289824,
          name: 'Manly',
          position: 'E',
      }

      const response = await global.testRequest.post('/beaches').send(newBeach)
      expect(response.status).toBe(201)
      expect(response.body).toEqual(expect.objectContaining(newBeach))
    })
  })
})
