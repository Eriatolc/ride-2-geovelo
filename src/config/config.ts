export default {
  strava: {
    clientId: process.env.STRAVA_CLIENTID as string || '',
    clientSecret: process.env.STRAVA_CLIENTSECRET as string || '',
    clientAccessToken: process.env.STRAVA_CLIENTACCESSTOKEN as string || '',
    clientRefreshToken: process.env.STRAVA_REFRESHTOKEN as string || ''
  },
  coros: {
    url: process.env.COROS_URL || '',
    loginEndpoint: process.env.COROS_LOGINENDPOINT || '',
    activityQueryEndpoint: process.env.COROS_ACTIVITYQUERYENDPOINT || '',
    activityDownloadEndpoint: process.env.COROS_ACTIVITYDOWNLOADENDPOINT || '',
    login: process.env.COROS_LOGIN || '',
    password: process.env.COROS_PASSWORD || ''
  },
  geovelo: {
    url: process.env.GEOVELO_URL || '',
    apiKey: process.env.GEOVELO_APIKEY || '',
    source: process.env.GEOVELO_SOURCE || '',
    login: process.env.GEOVELO_LOGIN || '',
    password: process.env.GEOVELO_PASSWORD || '',
    loginEndpoint: process.env.GEOVELO_LOGINENDPOINT || '',
    importGPXEndpoint : process.env.GEOVELO_IMPORTGPXENDPOINT || ''
  }
};
