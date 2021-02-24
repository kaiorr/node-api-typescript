import { StormGlass } from '@src/clients/stormGlass'
import * as HTTPUtil from '@src/util/request'
import stormGlassWeatherFixture from '@test/fixtures/stormGlass_weather_3_hours.json'
import stormGlassNormalizedFixture from '@test/fixtures/stormGlass_normalized_response_3_hours.json'

jest.mock('@src/util/request')

describe('StormGlass client', () => {

  const MockecdRquestClass = HTTPUtil.Request as jest.Mocked<typeof HTTPUtil.Request>

  //force inference types, only use tests cases || jest.mocked<>
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>

  it('Should return the normalized forecast from the StormGlass service', async () => {
    const lat= -33.792726
    const lng= 151.289824
    //force inference types, only use tests cases || jest.mocked<>
    mockedRequest.get.mockResolvedValue({ data: stormGlassWeatherFixture } as HTTPUtil.Response)

    const stormGlass = new StormGlass(mockedRequest)
    const response = await stormGlass.fetchPoints(lat, lng)
    expect(response).toEqual(stormGlassNormalizedFixture)
  })

  it('Should exclude incomplete data points', async () => {
    const lat= -33.792726
    const lng= 151.289824

    const incompleteResponse= {
      hours: [
        {
          windDiretion: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    }
    mockedRequest.get.mockResolvedValue({ data: incompleteResponse } as HTTPUtil.Response)

    const stormGlass = new StormGlass(mockedRequest)
    const response = await stormGlass.fetchPoints(lat, lng)

    expect(response).toEqual([])
  })

  it('Should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const lat= -33.792726
    const lng= 151.289824

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' })

    const stormGlass = new StormGlass(mockedRequest)

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to stormGlass: Network Error'
    )
  })

  it('Should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat= -33.792726
    const lng= 151.289824

    MockecdRquestClass.isRequestError.mockReturnValue(true)

    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] }
      }
    })

    const stormGlass = new StormGlass(mockedRequest)

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]}'
    )
  })
})
