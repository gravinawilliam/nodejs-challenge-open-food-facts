export type ProductImportHistory = {
  id: string;
  quantityImportedProducts: number;
  createdAt: Date;
  isSuccess: boolean;
  runtimeInMilliseconds: number;
};
