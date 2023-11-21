import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const env = dotenv.parse(fs.readFileSync('.env'));
export default {
  dialect: 'mysql',
  logging: console.log,
  logQueryParameters: true,
  define: { underscored: true },
  replication: {
    read: [
      {
        database: env.DB_READ_NAME,
        username: env.DB_READ_USERNAME,
        password: env.DB_READ_PASSWORD,
        host: env.DB_READ_HOST,
        port: +env.DB_READ_PORT,
      },
    ],
    write: {
      database: env.DB_NAME,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      host: env.DB_HOST,
      port: +env.DB_PORT,
    },
  },
  dialectOptions: {
    decimalNumbers: true,
    timezone: '+07:00',
  },
  timezone: '+07:00',
  models: [path.join(__dirname, '../../models/core')],
  synchronize: false,
};
