import endent from 'endent';
import figlet from 'figlet';

import { GLOBAL_CONFIG } from '@external/configs/infrastructure.config';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

export const showBanner = () => {
  const banner = endent`Application started successfully!
      ${figlet.textSync(GLOBAL_CONFIG.APP_NAME)}
       Version: ${GLOBAL_CONFIG.APP_VERSION}
       Port: ${GLOBAL_CONFIG.APP_PORT}
       Docs Path: ${GLOBAL_CONFIG.DOCS_PATH}
       Environment: ${GLOBAL_CONFIG.ENVIRONMENT}
    `;
  makeLoggerProvider().sendLogInfo({ message: banner });
};
