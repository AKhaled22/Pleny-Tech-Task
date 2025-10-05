/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { arrayFields } from '../constants/common.constants';
import { IModelMappingsForWhere } from '../interfaces/modelMapping.interface';
import * as qs from 'qs';

@Injectable()
export class FilterInterceptor<T extends keyof IModelMappingsForWhere>
  implements NestInterceptor
{
  constructor(
    private readonly filterableFields: Array<keyof IModelMappingsForWhere[T]>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const originalUrl = request.url;
    const queryStr = originalUrl.split('?')[1] ?? '';
    const parsedQuery = qs.parse(queryStr);

    const where: Record<string, any> = {};

    const filtersQuery = parsedQuery.filters;

    if (filtersQuery && typeof filtersQuery === 'object') {
      const buildNestedFilter = (
        key: string,
        value: any,
      ): Record<string, any> => {
        if (
          !this.filterableFields.includes(
            key as keyof IModelMappingsForWhere[T],
          )
        ) {
          return {};
        }

        let parsedValue: any;
        if (typeof value === 'string') {
          if (key === '_id') {
            parsedValue = value;
          } else if (arrayFields.includes(key)) {
            parsedValue = { $in: [value] };
          } else {
            parsedValue = { contains: value, mode: 'insensitive' };
          }
        } else {
          parsedValue = value;
        }

        return { [key]: parsedValue };
      };

      const filters: Record<string, any>[] = Object.entries(filtersQuery)
        .map(([key, value]) => buildNestedFilter(key, value))
        .filter((filter) => Object.keys(filter).length > 0);

      if (filters.length > 0) {
        where['$and'] = filters;
      }
    }

    request['where'] = where;

    return next.handle();
  }
}
