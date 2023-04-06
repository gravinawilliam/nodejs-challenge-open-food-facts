import { PrismaClient } from '@prisma/client';

import { GLOBAL_CONFIG } from '@infrastructure/configs/infrastructure.config';

export const prisma = new PrismaClient({
  log: GLOBAL_CONFIG.IS_PRODUCTION ? [] : ['query']
});
