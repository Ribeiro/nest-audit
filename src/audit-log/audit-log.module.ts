import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit-log.entity';
import { AuditLogInterceptor } from './audit-log.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditLogInterceptor],
})
export class AuditLogModule {}
