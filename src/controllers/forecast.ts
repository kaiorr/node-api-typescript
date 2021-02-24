import { Controller, Get } from '@overnightjs/core'
import { Beach } from '@src/model/beach'
import { Forecast } from '@src/services/forecast'
import { Request, Response } from 'express'

const forecast = new Forecast()

@Controller('forecast')
export class ForecastController {
  @Get('')
  public async getForecastForgeLoggedUser(_: Request, res: Response): Promise<void> {
    const beaches = await Beach.find({})
    const forecastData = await forecast.processForecastForBeaches(beaches)
    res.status(200).send(forecastData)
  }
}
