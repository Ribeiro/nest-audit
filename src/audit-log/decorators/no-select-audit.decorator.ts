import { SetMetadata } from '@nestjs/common';

export const NO_SELECT_AUDIT_KEY = 'noSelectAudit';
export const NoSelectAudit = () => SetMetadata(NO_SELECT_AUDIT_KEY, true);
