import { makeInfrastructure } from '@factories/infrastructure.factory';

import { crons } from '@main/crons/_crons';
import { Framework } from '@main/frameworks';

const start = async () => {
  makeInfrastructure();
  crons();
  await Framework.initializeExpress();
};

start();
