import {
  transformOas2Operations,
  transformOas3Operations,
  transformPostmanCollectionOperations,
} from '@stoplight/http-spec';
import { dereference } from 'json-schema-ref-parser';
import { IHttpOperation } from '@stoplight/types';
import { get } from 'lodash';
import type { Spec } from 'swagger-schema-official';
import type { OpenAPIObject } from 'openapi3-ts';
import type { CollectionDefinition } from 'postman-collection';

export async function getHttpOperationsFromResource(specFilePathOrObject: string | object): Promise<IHttpOperation[]> {
  return getHttpOperationsFromSpec(specFilePathOrObject);
}

export async function getHttpOperationsFromSpec(specFilePathOrObject: string | object): Promise<IHttpOperation[]> {
  const result = await dereference(specFilePathOrObject);

  if (isOpenAPI2(result)) return transformOas2Operations(result);
  if (isOpenAPI3(result)) return transformOas3Operations(result);
  if (isPostmanCollection(result)) return transformPostmanCollectionOperations(result);

  throw new Error('Unsupported document format');
}

function isOpenAPI2(document: unknown): document is Spec {
  return get(document, 'swagger');
}

function isOpenAPI3(document: unknown): document is OpenAPIObject {
  return get(document, 'openapi');
}

function isPostmanCollection(document: unknown): document is CollectionDefinition {
  return Array.isArray(get(document, 'item')) && get(document, 'info.name');
}
