// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
  production: false,
  publicPath: 'http://localhost:4205/',
  environmentName: 'LOCAL',
  redirectUrl: 'http://localhost:4200/',
  baseUrl:'https://pwmdev.52.154.157.71.nip.io/qualityapi/',
  scopeUri: ['api://f5505dec-ac14-42fd-a5bd-e1c890c1a233/pwm-access-profile'],
  authUrl:'https://pwmdev.52.154.157.71.nip.io/authorizationapi/',
  tenantId: 'cef04b19-7776-4a94-b89b-375c77a8f936',
  uiClientId: 'a9778b28-930e-4830-9261-b4d60154c52f',
  LoggingEndpointPath: `LookUpData/AuditLog`,
  logLevel: NgxLoggerLevel.TRACE,
  serverLogLevel: NgxLoggerLevel.OFF,
  isConsolLogEnabled: true,
  apiVersion:'v1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
