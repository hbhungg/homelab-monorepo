import { ConfigurableModuleBuilder, Global, Logger, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { DB } from './schema';
import { AppConfig } from 'src/app.config';

interface DatabaseOptions {
  connectionString: string;
}

const { ConfigurableModuleClass: ConfigurableDatabaseModule, MODULE_OPTIONS_TOKEN: DATABASE_OPTIONS } =
  new ConfigurableModuleBuilder<DatabaseOptions>().setClassMethodName('forRoot').build();

export const PG_POOL = 'PG_POOL';
export class Database extends Kysely<DB> {}

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      inject: [DATABASE_OPTIONS, AppConfig],
      useFactory: async (databaseOptions: DatabaseOptions, appConfig: AppConfig) => {
        const logger = new Logger(DatabaseModule.name);
        const pool = new Pool({
          connectionString: databaseOptions.connectionString,
          ...(appConfig.NODE_ENV !== 'localstack' && {
            ssl: { rejectUnauthorized: false },
          }),
          max: 20,
          min: 2,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000,
        });

        pool.on('error', (err) => logger.error('Pool error', err));
        try {
          logger.debug('Database connection test, running `SELECT 1`');
          await pool.query('SELECT 1');
          logger.log('Database connection established successfully');
        } catch (error) {
          logger.error('Failed to connect to the database');
          throw error;
        }
        return pool;
      },
    },
    {
      provide: Database,
      inject: [PG_POOL],
      useFactory: (pool: Pool) => {
        const dialect = new PostgresDialect({ pool: pool });
        return new Database({ dialect });
      },
    },
  ],
  exports: [Database, PG_POOL],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
