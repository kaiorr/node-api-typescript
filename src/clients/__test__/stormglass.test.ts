import { StormGlass } from '@src/clients/stormGlass'
import axios from 'axios'
import stormGlassWeatherFixture from '@test/fixtures/stormGlass_weather_3_hours.json'
import stormGlassNormalizedFixture from '@test/fixtures/stormGlass_normalized_response_3_hours.json'

jest.mock('axios')

describe('StormGlass client', () => {
  it('Should return the normalized forecast from the StormGlass service', async () => {
    const lat = -16.3714122
    const lng = -49.5162334

    axios.get = jest.fn().mockResolvedValue({ data: stormGlassWeatherFixture })

    const stormGlass = new StormGlass(axios)
    const response = await stormGlass.fetchPoints(lat, lng)
    expect(response).toEqual(stormGlassNormalizedFixture)
  })
})
