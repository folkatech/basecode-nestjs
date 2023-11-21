import sequelize from 'sequelize';
import { snakeCase } from 'lodash';
import { UnprocessableEntityException } from '@nestjs/common';
import { ClassTransformOptions, plainToClass, Transform } from 'class-transformer';
import { Literal } from 'sequelize/types/utils';
import ErrorCode from '../ErrorCode';
import { DOC_MIME, IMAGE_MIME } from '../constant';

export const circularToJSON = (circular: unknown) => JSON.parse(JSON.stringify(circular));

// eslint-disable-next-line max-len
export function generateViewModel<T, V>(cls: { new (...args: any[]): T }, obj: V[], options?: ClassTransformOptions): T[];
// eslint-disable-next-line max-len
export function generateViewModel<T, V>(cls: { new (...args: any[]): T }, obj: V, options?: ClassTransformOptions): T;
export function generateViewModel(...args: any[]) {
  const result = plainToClass(args[0], circularToJSON(args[1]), {
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
    enableImplicitConversion: true,
    ...args[2],
  });
  return result as unknown;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function formatPhoneNumberRemoveCountryCode(phoneNumber: string) {
  let formatPhoneNumber = phoneNumber.replace(/\s/g, '');
  if (formatPhoneNumber.startsWith('+')) {
    const temp = formatPhoneNumber.substring(3, formatPhoneNumber.length);
    formatPhoneNumber = `0${temp}`;
  } else if (formatPhoneNumber.startsWith('62')) {
    const temp = formatPhoneNumber.substring(2, formatPhoneNumber.length);
    formatPhoneNumber = `0${temp}`;
  } else if (!formatPhoneNumber.startsWith('0')) {
    formatPhoneNumber = `0${formatPhoneNumber}`;
  }
  return formatPhoneNumber;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function roundingWeight(weight: number, ceilMinimum: number) {
  const roundedDownWeight = Math.floor(weight);
  const roundNumber = weight - roundedDownWeight;

  if (roundNumber >= ceilMinimum) {
    return Math.ceil(roundNumber) + roundedDownWeight;
  }
  return Math.floor(roundNumber) + roundedDownWeight;
}

export function Default(defaultValue: unknown): PropertyDecorator {
  return Transform((obj: any) => obj?.value ?? defaultValue);
}

export const queryPaginationSort = (querySort: string, callback?: (field: string) => string | Literal, acceptedString?: string[]) => {
  const stringOrders = querySort?.split(',').filter(Boolean) || [];

  const orders = stringOrders.map((order) => {
    const orderFlow = order[0] === '-' ? 'desc' : 'asc';
    const orderBy = order[0] === '-' ? order.slice(1) : order;

    if (acceptedString && !acceptedString.includes(orderBy)) {
      throw new UnprocessableEntityException(`query sort '${order}' not accepted`, ErrorCode.VALIDATION);
    }

    const fieldCallback = callback(orderBy);

    if (typeof fieldCallback === 'string' && fieldCallback?.includes('.')) {
      const [table, attribute] = fieldCallback.split('.');
      return [sequelize.literal(`${table}.${snakeCase(attribute)}`), orderFlow];
    }

    return [fieldCallback, orderFlow];
  });
  return orders;
};

export function isEmpty(data: any = null): boolean {
  let result = false;
  if (typeof data === 'object') {
    if (JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') result = true;
    if (!data) result = true;
  } else if (typeof data === 'string') {
    if (!data.trim()) result = true;
  } else if (typeof data === 'undefined') {
    result = true;
  }

  return result;
}

export const allowedFileFilter = (req, file, callback) => {
  if (!DOC_MIME.includes(file.mimetype) && !IMAGE_MIME.includes(file.mimetype)) {
    return callback(new UnprocessableEntityException(`unknown file format, your mime type file is ${file.mimetype}`), false);
  }

  return callback(null, true);
};
