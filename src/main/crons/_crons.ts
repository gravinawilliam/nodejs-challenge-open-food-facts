import { importNewProductsCron } from './import-new-products.cron';

export const crons = () => {
  importNewProductsCron();
};
