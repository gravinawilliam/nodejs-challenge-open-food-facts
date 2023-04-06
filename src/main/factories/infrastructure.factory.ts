import { prisma } from '@infrastructure/database/prisma/prisma';

import { makeLoggerProvider } from './providers/logger-provider.factory';

export const makeInfrastructure = async () => {
  const logger = makeLoggerProvider();
  await prisma
    .$connect()
    // eslint-disable-next-line promise/always-return
    .then(() => {
      logger.sendLogInfo({
        message: 'Successfully connect prisma'
      });
    })
    .catch((error: any) => {
      logger.sendLogError({
        message: 'Failed to establish a connection to the database!',
        value: error
      });
      process.exit(1);
    });
};
