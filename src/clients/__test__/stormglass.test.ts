import { StormGlass } from '@src/clients/stormGlass'
import axios from 'axios'
import stormGlassWeatherFixture from '@test/fixtures/stormGlass_weather_3_hours.json'
import stormGlassNormalizedFixture from '@test/fixtures/stormGlass_normalized_response_3_hours.json'

jest.mock('axios')

describe('StormGlass client', () => {
  //force inference types, only use tests cases || jest.mocked<>
  const mockedAxios = axios as jest.Mocked<typeof axios>

  it('Should return the normalized forecast from the StormGlass service', async () => {
    const lat = -16.3714122
    const lng = -49.5162334
    //force inference types, only use tests cases || jest.mocked<>
    mockedAxios.get.mockResolvedValue({ data: stormGlassWeatherFixture })

    const stormGlass = new StormGlass(mockedAxios)
    const response = await stormGlass.fetchPoints(lat, lng)
    expect(response).toEqual(stormGlassNormalizedFixture)
  })
})
