// src/app.ts
import config from './config/config'
import { StravaService } from './services/strava.service'
import { CorosService } from './services/coros.service'
import { GeoveloService } from './services/geovelo.service'
import { DateTime } from 'luxon'
import * as  fs from 'fs'
import path from 'path'
// import ExtractorController from './controllers/extractor.controller';
// import PusherController from './controllers/pusher.controller';

// const extractor = new ExtractorController(config);
// const pusher = new PusherController(config);
async function main () {
  // const stravaService = new StravaService(config.strava.clientId, config.strava.clientSecret, config.strava.clientAccessToken)
  // const activities = await stravaService.getActivities()
  // console.log('activities : ', activities)

  const corosService = new CorosService ()
  await corosService.authenticate() 
  const corosActivities = await corosService.getRidingActivitiesByDate(DateTime.fromISO('2024-04-08'), DateTime.fromISO('2024-04-14') as DateTime)
  // console.log('corosActivities in app : ', corosActivities)

  // @ts-ignore
  const activitiesID = corosActivities.data.dataList.map(item => item.labelId)

  // const activitiesID = [
  //   '459853756350103553',
  //   '459790763406950401',
  //   '459781403867906048',
  //   '459767710172086273',
  //   '459760728700649472'
  // ]
  
  console.log('activitiesID => ', activitiesID)
  const corosGpxFile = await corosService.downloadGPX(activitiesID[3])
  // console.log('gpxFile ====> ', corosGpxFile)
  fs.writeFileSync(path.join(__dirname, '../coros.gpx'), corosGpxFile)

  // const gpxFile = fs.readFileSync(path.join(__dirname, '../coros.gpx')).toString()
  // console.log('gpxFile => ', gpxFile)

  const geovelo = new GeoveloService()
  await geovelo.authenticate()
  await geovelo.pushGPX(corosGpxFile, activitiesID[0])
  // fs.writeFileSync(path.join(__dirname, '../newGPX.gpx'), newGpx)
}

main()
