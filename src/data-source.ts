// src/data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AuditLog } from './audit-log/audit-log.entity';

console.log('DB_USERNAME:', process.env.DB_USERNAME);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [AuditLog],
  synchronize: false,
  logging: true,
});
