import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuditLogInterceptor } from './audit-log/audit-log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(app.get(AuditLogInterceptor));
  await app.listen(3000);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
