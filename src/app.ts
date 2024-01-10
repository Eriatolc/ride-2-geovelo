// src/app.ts
import config from './config/config';
import { StravaService } from './services/strava.service';
// import ExtractorController from './controllers/extractor.controller';
// import PusherController from './controllers/pusher.controller';

// const extractor = new ExtractorController(config);
// const pusher = new PusherController(config);
async function main () {
  const stravaService = new StravaService(config.strava.clientId, config.strava.clientSecret, config.strava.clientAccessToken)
  const activities = await stravaService.getActivities()
  console.log('activities : ', activities)
};

main();
