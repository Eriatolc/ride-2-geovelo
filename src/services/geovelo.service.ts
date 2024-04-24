// services/geovelo.service.ts
import axios from 'axios'
import config from '../config/config'
import * as  fs from 'fs'
import path from 'path'

export class GeoveloService {
  private login: string
  private password: string
  private url: string
  private accessToken: string
  private apiKey: string
  private source: string
  private userID: string

  constructor () {
    this.login = config.geovelo.login
    this.password = config.geovelo.password
    this.url = config.geovelo.url
    this.accessToken = ''
    this.apiKey = config.geovelo.apiKey
    this.source = config.geovelo.source
    this.userID = ''
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
      console.log('authenticateResponse => ', response.headers)
      this.accessToken = response.headers['authorization']
      this.userID = response.headers['userid']
      console.log('this.accessToken => ', this.accessToken)
      console.log('this.userID => ', this.userID)
    } catch (error) {
      console.error('Geovelo authentication error:', error)
      // if (hasMessage(error)) throw new Error(`Strava authentication error: ${error.message}`);
    }
  }

  public async pushGPX (gpxFile: string, labelId: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authenticated on Geovelo. Please authenticate first.')
    }

    if (!gpxFile) {
      throw new Error('No GPX file to send!')
    }
    // const timestamp = new Date().getTime()
    const timestamp = "22303371055826668733134596594"
    const boundary = `-----------------------------${timestamp}`
    const blankLine = '\r\n'
    const firstLineContentDisposition = `Content-Disposition: form-data; name="gpx"; filename="${labelId}.gpx"\r\n`
    const firstLineContentType = 'Content-Type: application/octet-stream\r\n'

    const prefix = boundary + blankLine + firstLineContentDisposition + firstLineContentType + blankLine

    const contentDisposition = 'Content-Disposition: form-data; name="title"\r\n'
    const labelIdLine = `${labelId}\r\n`
    const endBoundary = '--'
    const suffix = blankLine + boundary + blankLine + contentDisposition + blankLine + labelIdLine + boundary + endBoundary + blankLine

    gpxFile = prefix + gpxFile + suffix

    try {
      console.log('URL : ', `${this.url}${config.geovelo.importGPXEndpoint}`)
      fs.writeFileSync(path.join(__dirname, '../../preparedGPX.gpx'), gpxFile)
      const response = await axios.post(
        `${this.url}${config.geovelo.importGPXEndpoint}`,
        gpxFile,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
            "Accept": "*/*",
            "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": `multipart/form-data; boundary=${boundary}`,
            "Authorization": this.accessToken,
            "Api-key": this.apiKey,
            "Source": this.source
          }
        }
      )
      console.log('pushGPXReponse => ', response)
    } catch (error) {
      console.error('Geovelo import GPX error:', error)
    }
  }
}
