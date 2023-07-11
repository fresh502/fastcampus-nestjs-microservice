import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'download_cnt', default: 0 })
  downloadCnt: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column()
  videoId: string;
}
