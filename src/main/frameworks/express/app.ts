import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import helmet from 'helmet';

import { GLOBAL_CONFIG } from '@infrastructure/configs/infrastructure.config';

import { morganMiddleware } from '@main/frameworks/express/middlewares/morgan.middleware';
import { notFoundRouteMiddleware } from '@main/frameworks/express/middlewares/not-found-route.middleware';
import { showBanner } from '@main/utils/banner.util';

import routes from './routes/_index';

export class ExpressFramework {
  public app: Application;

  constructor() {
    this.app = express();
  }

  public async execute(): Promise<Application> {
    this.middlewaresBeforeRoutes();

    this.app.use(routes);

    this.middlewaresAfterRoutes();

    this.app.listen(GLOBAL_CONFIG.APP_PORT, () => showBanner());

    return this.app;
  }

  private middlewaresBeforeRoutes(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(helmet());
    this.app.use(morganMiddleware());
  }

  private middlewaresAfterRoutes(): void {
    this.app.use(notFoundRouteMiddleware());
  }
}
