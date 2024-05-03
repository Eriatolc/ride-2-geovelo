// src/config/config.test.ts
import config from '../src/config/config';

describe('Configuration', () => {
  it('should have defined values for Strava configuration', () => {
    expect(config.strava.clientId).toBeDefined();
    expect(config.strava.clientSecret).toBeDefined();
    expect(config.strava.clientAccessToken).toBeDefined();
    expect(config.strava.clientRefreshToken).toBeDefined();
  });

  it('should have defined values for Coros configuration', () => {
    expect(config.coros.url).toBeDefined();
    expect(config.coros.loginEndpoint).toBeDefined();
    expect(config.coros.activityQueryEndpoint).toBeDefined();
    expect(config.coros.activityDownloadEndpoint).toBeDefined();
    expect(config.coros.login).toBeDefined();
    expect(config.coros.password).toBeDefined();
  });

  it('should have defined values for Geovelo configuration', () => {
    expect(config.geovelo.url).toBeDefined();
    expect(config.geovelo.apiKey).toBeDefined();
    expect(config.geovelo.source).toBeDefined();
    expect(config.geovelo.login).toBeDefined();
    expect(config.geovelo.password).toBeDefined();
    expect(config.geovelo.loginEndpoint).toBeDefined();
    expect(config.geovelo.importGPXEndpoint).toBeDefined();
  });
});
