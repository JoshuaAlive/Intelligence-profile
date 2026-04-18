import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column()
  gender!: string;

  @Column('float')
  gender_probability!: number;

  @Column('int')
  sample_size!: number;

  @Column('int')
  age!: number;

  @Column()
  age_group!: string;

  @Column()
  country_id!: string;

  @Column('float')
  country_probability!: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
