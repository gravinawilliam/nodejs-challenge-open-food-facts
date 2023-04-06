import { faker } from '@faker-js/faker';

import { Product, ProductStatus } from '@models/product.model';

export const productStatus = (): ProductStatus => {
  const randomNumber = Number(faker.random.numeric(2));
  if (randomNumber < 33) {
    return ProductStatus.DRAFT;
  } else if (randomNumber >= 33 && randomNumber < 66) {
    return ProductStatus.PUBLISHED;
  } else {
    return ProductStatus.TRASH;
  }
};

export const productCode = (): string => faker.random.numeric(13);

export const product = (): Product => ({
  brands: faker.lorem.word(),
  categories: faker.lorem.word(),
  cities: faker.random.word(),
  code: productCode(),
  createdT: faker.date.past().toString(),
  creator: faker.random.word(),
  id: faker.datatype.uuid(),
  imageUrl: faker.image.imageUrl(),
  importedT: faker.date.past(),
  ingredientsText: faker.lorem.words(),
  labels: faker.lorem.words(),
  lastModifiedT: faker.date.past().toString(),
  mainCategory: faker.lorem.word(),
  nutriscoreGrade: faker.random.word(),
  nutriscoreScore: faker.random.word(),
  productName: faker.lorem.word(),
  purchasePlaces: faker.lorem.word(),
  quantity: faker.lorem.word(),
  servingQuantity: faker.lorem.word(),
  servingSize: faker.lorem.word(),
  status: productStatus(),
  stores: faker.lorem.word(),
  traces: faker.lorem.word(),
  url: faker.internet.url()
});

export const products = (parameters: { quantity: number }): Product[] => {
  const items: Product[] = [];
  for (let index = 0; index < parameters.quantity; index++) items.push(product());
  return items;
};

export const productsWithCodeOnly = (parameters: { quantity: number }): Pick<Product, 'code'>[] => {
  const items: Pick<Product, 'code'>[] = [];
  for (let index = 0; index < parameters.quantity; index++) items.push({ code: productCode() });
  return items;
};
