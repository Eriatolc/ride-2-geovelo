// src/app.ts
import { CorosService } from './services/coros.service'
import { GeoveloService } from './services/geovelo.service'
import config from './config/config'
import { DateTime } from 'luxon'

async function main () {
  console.log('Starting ride2geovelo application...')
  console.log('Config used: ', config)
  const today = DateTime.now()
  console.log('Syncing rides for the date: ', today.toLocaleString({ month: 'long', day: 'numeric' }))
  const geovelo = new GeoveloService()
  await geovelo.authenticate()
  
  const corosService = new CorosService ()
  await corosService.authenticate()
  console.log('Getting activities from Coros...')
  const corosActivities = await corosService.getRidingActivitiesByDate(today, today)

  let count = 0
  if (corosActivities && corosActivities.length > 0) {
    // @ts-ignore
    const activitiesID = corosActivities.map(item => item.labelId)
    console.log(`${activitiesID.length} activites to upload...`)
    let corosGPXFile
    for await (const item of activitiesID) {
      console.log('item loaded : ', item)
      console.log('downloading GPX file...')
      corosGPXFile = await corosService.downloadGPX(item)
      console.log('GPX file downloaded. Pushing to Geovelo...')
      await geovelo.pushGPX(corosGPXFile, item)
      console.log('GPX file successfully pushed to Geovelo.')
      count++
    }
  }
  console.log(`${count} riding activities have been pushed from Coros to Geovelo for ${today.toLocaleString({ month: 'long', day: 'numeric' })}.`)
}

main()
