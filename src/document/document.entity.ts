import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Document {
  @PrimaryColumn()
  id: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.documents, { nullable: true })
  author: User;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
