import { DataType } from 'sequelize-typescript';
import { Migration } from '@config/database/migration.provider';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('error_log', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status_code: {
        type: DataType.STRING,
        allowNull: true,
      },
      code: {
        type: DataType.STRING,
        allowNull: true,
      },
      path: {
        type: DataType.TEXT,
        allowNull: true,
      },
      message: {
        type: DataType.TEXT,
        allowNull: true,
      },
      request: {
        type: DataType.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      user: {
        type: DataType.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      reference: {
        type: DataType.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      headers: {
        type: DataType.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      timestamp: {
        type: DataType.DATE,
        allowNull: true,
      },
      created_at: DataType.DATE,
      updated_at: DataType.DATE,
    });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('table_name');
  });
};
