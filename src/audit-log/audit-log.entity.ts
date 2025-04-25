import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ActionType } from './action.enum'; // Importa o enum ActionType

@Entity('audit_log')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  action: ActionType;

  @Column({ type: 'jsonb', nullable: true })
  oldData: any;

  @Column({ type: 'jsonb', nullable: true })
  newData: any;

  @Column()
  tableName: string;

  @Column()
  userName: string;

  @Column({ nullable: true })
  traceId: string;

  @Column({ nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  createdAt: Date;
}
