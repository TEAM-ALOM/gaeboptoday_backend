import { plainToClass } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  NAVER_OCR_SECRET: string;

  @IsString()
  OCR_INVOKE_URL: string;

  @IsString()
  AWS_REGION: string;

  @IsString()
  AWS_S3_ACCESS_KEY: string;

  @IsString()
  AWS_S3_SECRET_ACCESS_KEY: string;

  @IsString()
  AWS_S3_BUCKET_NAME: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
