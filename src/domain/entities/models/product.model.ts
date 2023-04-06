export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  TRASH = 'trash',
  INVALID_STATUS = 'invalid_status'
}

export const selectProductStatus = (status: string): ProductStatus => {
  switch (status.toLowerCase()) {
    case 'draft': {
      return ProductStatus.DRAFT;
    }
    case 'published': {
      return ProductStatus.PUBLISHED;
    }
    case 'trash': {
      return ProductStatus.TRASH;
    }
    default: {
      return ProductStatus.INVALID_STATUS;
    }
  }
};

export type Product = {
  id: string;
  status: ProductStatus;
  code: string;
  importedT: Date;
  url: string;
  creator: string;
  createdT: string;
  lastModifiedT: string;
  productName: string;
  quantity: string;
  brands: string;
  categories: string;
  labels: string;
  cities: string;
  purchasePlaces: string;
  stores: string;
  ingredientsText: string;
  traces: string;
  servingSize: string;
  servingQuantity: string;
  nutriscoreScore: string;
  nutriscoreGrade: string;
  mainCategory: string;
  imageUrl: string;
};
