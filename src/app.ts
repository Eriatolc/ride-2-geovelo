// src/app.ts
import { CorosService } from './services/coros.service'
import { GeoveloService } from './services/geovelo.service'
import { DateTime } from 'luxon'

async function main () {
  console.log('Starting ride2geovelo application...')
  const today = DateTime.now()

  const geovelo = new GeoveloService()
  await geovelo.authenticate()
  
  const corosService = new CorosService ()
  await corosService.authenticate()
  const corosActivities = await corosService.getRidingActivitiesByDate(today, today)

  console.log('Getting activities from Coros...')
  // @ts-ignore
  const activitiesID = corosActivities.data.dataList.map(item => item.labelId)
  console.log(`${activitiesID.length} activites to upload...`)
  let corosGPXFile
  let count = 0
  for await (const item of activitiesID) {
    console.log('item loaded : ', item)
    console.log('downloading GPX file...')
    corosGPXFile = await corosService.downloadGPX(item)
    console.log('GPX file downloaded. Pushing to Geovelo...')
    await geovelo.pushGPX(corosGPXFile, item)
    console.log('GPX file successfully pushed to Geovelo.')
    count++
  }
  console.log(`${count} riding activities have been pushed from Coros to Geovelo.`)
}

main()
