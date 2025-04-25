/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { AuditLog } from './audit-log.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionType } from './action.enum';
import { mergeMap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const traceId = request.headers['x-amzn-trace-id'] ?? 'N/A';
    const userName = request.headers['username'] ?? 'Unknown User';
    const ipAddress = request.ip ?? 'N/A';
    const action = this.getActionTypeFromMethod(request.method);

    const noAudit = this.reflector.getAllAndOverride<boolean>('noSelectAudit', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (action === ActionType.SELECT && noAudit) {
      return next.handle();
    }

    return next.handle().pipe(
      mergeMap((data) => {
        const auditLog = new AuditLog();
        auditLog.action = action;
        auditLog.tableName = context.getHandler().name;
        auditLog.userName = userName;
        auditLog.traceId = traceId;
        auditLog.ipAddress = ipAddress;
        auditLog.createdAt = new Date();

        if (action === ActionType.UPDATE && data.oldData && data.newData) {
          auditLog.oldData = data.oldData;
          auditLog.newData = data.newData;
        }

        return from(this.auditLogRepository.save(auditLog)).pipe(
          mergeMap(() => {
            return [data];
          }),
        );
      }),
    );
  }

  private getActionTypeFromMethod(method: string): ActionType {
    switch (method) {
      case 'POST':
        return ActionType.INSERT;
      case 'PUT':
        return ActionType.UPDATE;
      case 'DELETE':
        return ActionType.DELETE;
      case 'GET':
        return ActionType.SELECT;
      default:
        return ActionType.UPDATE;
    }
  }
}
