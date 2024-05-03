// services/geovelo.service.ts
import axios from 'axios'
import FormData from 'form-data'
import config from '../config/config'

export class GeoveloService {
  private login: string
  private password: string
  private url: string
  private accessToken: string
  private apiKey: string
  private source: string

  constructor () {
    this.login = config.geovelo.login
    this.password = config.geovelo.password
    this.url = config.geovelo.url
    this.accessToken = ''
    this.apiKey = config.geovelo.apiKey
    this.source = config.geovelo.source
  }

  public async authenticate (): Promise<void> {

    const data = `${this.login};${this.password}`
    const buff = Buffer.from(data)
    const base64 = buff.toString('base64')

    try {
      const response = await axios.post(
        `${this.url}${config.geovelo.loginEndpoint}`,
        '',
        {
          headers: {
            Authentication: `${base64}`,
            "Api-key": this.apiKey,
            Source: this.source
          }
        }
      )
      this.accessToken = response.headers['authorization']
    } catch (error) {
      console.error('Geovelo authentication error:', error)
    }
  }

  public async pushGPX (gpxFile: string, labelId: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authenticated on Geovelo. Please authenticate first.')
    }

    if (!gpxFile) {
      throw new Error('No GPX file to send!')
    }

    const formData = new FormData()
    formData.append('gpx', gpxFile, { filename: `${labelId}.gpx` })
    formData.append('title', labelId)

    try {
      const response = await axios.post(
        `${this.url}${config.geovelo.importGPXEndpoint}`,
        formData,
        {
          headers: {
            Authorization: this.accessToken,
            'Api-key': this.apiKey,
            Source: this.source,
            'Content-Type': `multipart/form-data`
          }
        }
      )
    } catch (error) {
      console.error('Geovelo import GPX error:', error)
    }
  }
}
