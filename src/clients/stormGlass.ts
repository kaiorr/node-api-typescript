import { AxiosStatic } from 'axios'

export interface StormGlassPointSource {
  [key: string]: number
}

export interface StormGlassPoint {
  readonly swellDirection: StormGlassPointSource
  readonly swellHeight: StormGlassPointSource
  readonly swellPeriod: StormGlassPointSource
  readonly time: string
  readonly waveDirection: StormGlassPointSource
  readonly waveHeight: StormGlassPointSource
  readonly windDirection: StormGlassPointSource
  readonly windSpeed: StormGlassPointSource
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[]
}

export interface ForecastPoint {
  swellDirection: number
  swellHeight: number
  swellPeriod: number
  time: string
  waveDirection: number
  waveHeight: number
  windDirection: number
  windSpeed: number
}

export class StormGlass {

  readonly stormGlassAPIParams =  'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';

  readonly stormGlassAPISource = 'noaa';

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    try {
      const response = await this.request.get<StormGlassForecastResponse>
      (`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}
      &params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`,
        {
        headers: {
          Authorization: 'fake-token',
        },
      })

      return this.normalizeResponse(response.data)
    } catch(err) {
        throw new Error(`Unexpected error when trying to communicate to stormGlass: ${err.message}`)
    }
  }

  private normalizeResponse(points: StormGlassForecastResponse): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      time: point.time,
      swellDirection: point.swellDirection?.[this.stormGlassAPISource],
      swellHeight: point.swellHeight?.[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod?.[this.stormGlassAPISource],
      waveDirection: point.waveDirection?.[this.stormGlassAPISource],
      waveHeight: point.waveHeight?.[this.stormGlassAPISource],
      windDirection: point.windDirection?.[this.stormGlassAPISource],
      windSpeed: point.windSpeed?.[this.stormGlassAPISource]
    }))
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    )
  }
}
