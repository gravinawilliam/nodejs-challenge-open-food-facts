import cron from 'node-cron';

import { makeCronImportNewProductsUseCase } from '@factories/use-cases/products/cron-import-new-products-use-case.factory';

export const importNewProductsCron = async (): Promise<void> => {
  cron.schedule('*/10 * * * *', async () => {
    console.log('Cron importNewProductsCron started');
    await makeCronImportNewProductsUseCase().execute(undefined);
  });
};
