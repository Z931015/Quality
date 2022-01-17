import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
    production: true,
    publicPath: 'https://pwmdev.52.154.157.71.nip.io/quality-assurance/',
    environmentName: 'DEV',
    redirectUrl: 'https://pwmdev.52.154.157.71.nip.io',
    baseUrl:'https://pwmdev.52.154.157.71.nip.io/qualityapi/',
  authUrl:'https://pwmdev.52.154.157.71.nip.io/authorizationapi/',
  scopeUri: ['api://f5505dec-ac14-42fd-a5bd-e1c890c1a233/pwm-access-profile'],
    tenantId: 'cef04b19-7776-4a94-b89b-375c77a8f936',
    uiClientId: 'a9778b28-930e-4830-9261-b4d60154c52f',
    LoggingEndpointPath: `LookUpData/AuditLog`,
    logLevel: NgxLoggerLevel.TRACE,
    serverLogLevel: NgxLoggerLevel.OFF,
    isConsolLogEnabled: true,
    apiVersion:'v1'

};
