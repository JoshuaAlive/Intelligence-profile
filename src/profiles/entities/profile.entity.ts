import { Entity, Column, PrimaryColumn } from 'typeorm';

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

  @Column({ type: 'timestamp' })
  created_at!: Date;
}
