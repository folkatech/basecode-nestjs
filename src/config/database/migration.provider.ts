import * as fs from 'fs';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeStorage, Umzug } from 'umzug';
import { databasePath } from '../../migrations/migration-template';

import config from './config';

/** DATABASE MIGRATOR */
const sequelize = new Sequelize(config as any);

export const migrator = new Umzug({
  migrations: { glob: ['core/*.ts', { cwd: databasePath }] },
  create: {
    folder: `${databasePath}/core`,
    template: (filepath) => [
      [
        filepath,
        fs.readFileSync(`${databasePath}/migration-template.ts`).toString(),
      ],
    ],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;
