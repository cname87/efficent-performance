import { NgxLoggerLevel } from 'ngx-logger';

/* For easier debugging in development mode, you can import the following file
 to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.

 This import should be commented out in production mode because it will have a negative impact on performance if an error is thrown.
 */
/* leave commented out by default to simulate production */
// import 'zone.js/dist/zone-error'; // Included with Angular CLI.

export const environment = {
  /* default to production optimized (true) */
  production: true,

  /* set true to enable error and cache testing */
  e2eTesting: true,

  /* default to console logging level OFF - same as production setting */
  /* change to TRACE for debug only */
  logLevel: NgxLoggerLevel.OFF,

  /* sets audience which is the unique identifier to the OAuth API - note that the reference to https://localhost:8080 is not relevant but cannot be changed */
  get apiUrl(): string {
    return 'https://localhost:8080/api-v1/';
  },
};
