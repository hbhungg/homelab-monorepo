import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';

export const auth = betterAuth({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  database: new Database('database.db'),
  emailAndPassword: { enabled: true },
});
