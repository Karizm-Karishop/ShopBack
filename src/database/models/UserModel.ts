import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { OtpToken } from './OtpToken';
import ShopModel from './ShopModel';
import AlbumModel from './AlbumModel';
import { ProductModel } from './ProductModel';
import CategoryModel from './CategoryModel';
import BookModel from './BookModel'
import NotificationModel from './NotificationModel';
export enum UserRole {
  ARTIST = 'artist',
  CLIENT = 'client',
  ADMIN = 'admin'
}

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

  @Column({ nullable: true })
  biography: string;

  @Column({ type: 'simple-array', nullable: true })
  genres: string[];


  @Column({ type: 'json', nullable: true })
  socialLinks: {
    twitter: string;
    linkedin: string;
    facebook: string;
    google: string;
  };

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

  @OneToMany(() => AlbumModel, (album) => album.artist)
  albums: AlbumModel[];

  @OneToMany(() => CategoryModel, (category) => category.artist)
  categories: CategoryModel[];
  
  @OneToMany(() => ProductModel, (product) => product.artist)
  products: ProductModel[];

  @OneToMany(() => BookModel, (book) => book.artist)
  books: BookModel[];
  
  @OneToMany(() => NotificationModel, (notification) => notification.user)
  notifications: NotificationModel[]; 

  constructor(user: Partial<UserModel>) {
    Object.assign(this, user)
  }
}