import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { LoggerModule } from 'nestjs-pino';
import { AppConfig, AppConfigModule } from './app.config';
import { DatabaseModule, PG_POOL } from './database/database.module';
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
      },
    }),
    AppConfigModule,
    DatabaseModule.forRootAsync({
      inject: [AppConfig],
      useFactory: (env: AppConfig) => ({
        connectionString: env.DATABASE_URL ?? '',
      }),
    }),
    AuthModule.forRootAsync({
      inject: [PG_POOL],
      useFactory: (pool: Pool) => {
        const auth = betterAuth({
          database: pool,
          emailAndPassword: { enabled: true },
          fetchOptions: { throw: true },
        });
        console.log(auth);
        return { auth: auth };
      },
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
