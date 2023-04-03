import { makeInfrastructure } from '@factories/infrastructure.factory';

import { Framework } from '@main/frameworks';

const start = async () => {
  makeInfrastructure();
  await Framework.initializeExpress();
};

start();
