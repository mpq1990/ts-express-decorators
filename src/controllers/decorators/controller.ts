import 'reflect-metadata';
import { AppRouter } from '../../AppRouter';
import { Methods } from './Methods';
import { Metadatakeys } from './MetadataKeys';
import { NextFunction, RequestHandler, Request, Response } from 'express';

function bodyValidators(keys: string[]): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      res.status(422).send('Invalid requests');
      return;
    }

    for (let key of keys) {
      if (!req.body[key]) {
        res.status(422).send(`Missing property ${key}`);
        return;
      }
    }

    next();
  };
}

export function controller(routePrefix: string) {
  return function (target: Function) {
    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];

      const path = Reflect.getMetadata(
        Metadatakeys.PATH,
        target.prototype,
        key
      );
      const method: Methods = Reflect.getMetadata(
        Metadatakeys.METHOD,
        target.prototype,
        key
      );

      let middlewares =
        Reflect.getMetadata(Metadatakeys.MIDDLEWARE, target.prototype, key) ||
        [];

      const requiredBodyProps =
        Reflect.getMetadata(Metadatakeys.VALIDATOR, target.prototype, key) ||
        [];

      const validator = bodyValidators(requiredBodyProps);
      if (path) {
        AppRouter.instance[method](
          `${routePrefix}${path}`,
          ...middlewares,
          validator,
          routeHandler
        );
      }
    }
  };
}
