import { PostgresDialect } from 'kysely';
import { defineConfig } from 'kysely-ctl';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  plugins: [],
  migrations: {
    migrationFolder: 'migrations',
  },
  seeds: {
    seedFolder: 'seeds',
  },
});
