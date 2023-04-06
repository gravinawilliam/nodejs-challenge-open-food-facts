import {
  getEnvironmentNumber,
  getEnvironmentString
} from '@infrastructure/providers/get-envs/dot-environment.get-environments-provider';

enum NODE_ENV {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION'
}

export const GLOBAL_CONFIG = {
  ENVIRONMENT: getEnvironmentString({
    defaultValue: NODE_ENV.DEVELOPMENT,
    key: 'NODE_ENV'
  }),
  IS_DEVELOPMENT:
    getEnvironmentString({
      defaultValue: NODE_ENV.DEVELOPMENT,
      key: 'NODE_ENV'
    }) === NODE_ENV.DEVELOPMENT,
  IS_PRODUCTION:
    getEnvironmentString({
      defaultValue: NODE_ENV.DEVELOPMENT,
      key: 'NODE_ENV'
    }) === NODE_ENV.PRODUCTION,
  LOGS_FOLDER: getEnvironmentString({
    defaultValue: 'logs',
    key: 'LOGS_FOLDER'
  }),
  APP_NAME: getEnvironmentString({
    defaultValue: 'template-name',
    key: 'APP_NAME'
  }),
  APP_VERSION: '0.0.0',
  APP_PORT: getEnvironmentNumber({
    defaultValue: 2222,
    key: 'APP_PORT'
  }),
  DOCS_PATH: getEnvironmentString({
    defaultValue: '/docs',
    key: 'DOCS_PATH'
  })
};
