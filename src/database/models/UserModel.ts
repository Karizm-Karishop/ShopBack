import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { OtpToken } from './OtpToken'
export enum UserRole {
  ARTIST = 'artist',
  CLIENT = 'client',
  ADMIN = 'admin'
}
import ShopModel from './ShopModel';
@Entity()
export default class UserModel {
  @PrimaryGeneratedColumn()
  user_id: number;
  @Column({ type: 'timestamp', nullable: true })
  otpLockUntil: Date | null;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;  

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true })
  gender: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  lastPasswordReset: Date;
  
  @Column({ nullable: true, unique: true })
  googleId: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: 'active' })
  status: 'active' | 'inactive';

  @Column({ type: 'int', nullable: true })
  twoFactorCode: number | null;

  @Column({ type: 'boolean', default: false }) 
  is2FAEnabled: boolean;

  @Column({ default: 0 })
  otpAttempts: number;
  @OneToMany(() => OtpToken, otpToken => otpToken.user)
  otpTokens: OtpToken[];
  id: any;
  
  @OneToMany(() => ShopModel, (shop) => shop.artist)
  shops: ShopModel[]; 

  constructor(user: Partial<UserModel>) {
    Object.assign(this, user)
  }
}
