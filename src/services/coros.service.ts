// services/coros.service.ts
import axios from 'axios'
import config from '../config/config'
import { DateTime } from 'luxon'

export class CorosService {
  private login: string
  private password: string
  private url: string
  private accessToken: string

  constructor () {
    this.login = config.coros.login as string
    this.password = config.coros.password as string
    this.url = config.coros.url as string
    this.accessToken = ''
  }

  public async authenticate (): Promise<void> {
    try {
      const body = {
        account: this.login,
        accountType: 2,
        pwd: this.password
      }

      const response = await axios.post(
        `${this.url}${config.coros.loginEndpoint}`,
        JSON.stringify(body),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )
      this.accessToken = response.data.data.accessToken
    } catch (error) {
      console.error('Coros authentication error:', error)
    }
  }

  public async getRidingActivitiesByDate (startDay: DateTime, endDay: DateTime): Promise<any[]> {
    if (!this.accessToken || this.accessToken === '') {
      throw new Error('Not authenticated on Coros. Please authenticate first.')
    }

    const formattedStartDay = startDay.toFormat('yyyyMMdd')
    const formattedEndDay = endDay.toFormat('yyyyMMdd')

    const SIZE = '50'
    const PAGE_NUMBER = '1'
    const MODE_LIST = '299,200'

    try {
      const response = await axios.get(
        `${this.url}${config.coros.activityQueryEndpoint}?size=${SIZE}&pageNumber=${PAGE_NUMBER}&modeList=${MODE_LIST}&startDay=${formattedStartDay}&endDay=${formattedEndDay}`,
        {
          headers: { accessToken: `${this.accessToken}` },
        }
      )
      return response.data.data.dataList
    } catch (error) {
      console.error('Coros getRidingActivities error:', error)
      return []
    }
  }

  public async downloadGPX (activityLabel: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authenticated on Coros. Please authenticate first.')
    }

    if (!activityLabel || activityLabel === '') {
      throw new Error('No activity label defined!')
    }

    const SPORT_TYPE = '200' // For riding activity
    const FILE_TYPE = '1' // For GPX file

    try {
      const response = await axios.get(
        `${this.url}${config.coros.activityDownloadEndpoint}?labelId=${activityLabel}&sportType=${SPORT_TYPE}&fileType=${FILE_TYPE}`,
        {
          headers: { accessToken: `${this.accessToken}` },
        }
      )
      const downloadUrl = response.data.data.fileUrl
      const gpxFile = await axios.get(downloadUrl, { headers: { accessToken: `${this.accessToken}` } })
      return gpxFile.data
    } catch (error) {
      console.error('Coros download GPX error:', error)
      return {}
    }
  }
}
