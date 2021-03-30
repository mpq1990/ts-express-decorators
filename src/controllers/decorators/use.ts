import { RequestHandler } from 'express';
import 'reflect-metadata';
import { Metadatakeys } from './MetadataKeys';

export function use(middleware: RequestHandler) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    const middlewares =
      Reflect.getMetadata(Metadatakeys.MIDDLEWARE, target, key) || [];

    Reflect.defineMetadata(
      Metadatakeys.MIDDLEWARE,
      [...middlewares, middleware],
      target,
      key
    );
  };
}
