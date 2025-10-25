import { IsString, IsNumber, IsIn, validateSync, IsNotEmpty } from 'class-validator';
import { plainToClass, Transform } from 'class-transformer';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// **** Add env schema in here ***
export class AppConfig {
  @IsString()
  @IsIn(['development', 'production', 'localstack'])
  NODE_ENV = 'development';

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10) || 3000)
  PORT = 3000;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  BETTER_AUTH_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(AppConfig, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });
  if (errors.length > 0) throw new Error(errors.toString());
  return validatedConfig;
}

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate })],
  providers: [{ provide: AppConfig, useValue: validate(process.env) }],
  exports: [AppConfig],
})
export class AppConfigModule {}
