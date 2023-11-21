import { AllowNull, Column, Default, Table } from 'sequelize-typescript';

import { Cache, Model } from 'base-repo';
import { IUnfilledAtt } from '@utils/base-class/base.interface';

interface IModelOptional {
  id: number;
}

interface IModel extends Partial<IUnfilledAtt>, Partial<IModelOptional> {
  statusCode: string;
  code: string;
  path: string;
  message: string;
  timestamp: Date;
  request: string;
  user: string;
  reference: string;
  headers: string;
}

export type IModelCreate = Omit<IModel, 'id'>;

@Cache()
@Table({
  tableName: 'error_log',
  indexes: [],
})
export class ErrorLog extends Model<IModel, IModelCreate> implements IModel {
  @AllowNull(true)
  @Column
  statusCode: string;

  @AllowNull(true)
  @Column
  code: string;

  @AllowNull(true)
  @Column
  path: string;

  @AllowNull(true)
  @Column
  message: string;

  @AllowNull(true)
  @Column
  timestamp: Date;

  @AllowNull(true)
  @Column
  request: string;

  @AllowNull(true)
  @Column
  user: string;

  @AllowNull(true)
  @Column
  reference: string;

  @AllowNull(true)
  @Column
  headers: string;

  @Default(new Date())
  @AllowNull(false)
  @Column
  createdAt: Date;

  @Default(new Date())
  @AllowNull(false)
  @Column
  updatedAt: Date;
}
