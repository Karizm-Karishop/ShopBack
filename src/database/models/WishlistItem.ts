import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column
} from 'typeorm';
import { ProductModel } from './ProductModel';
import UserModel from './UserModel';
@Entity('wishlists')
export class WishlistItem {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UserModel, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column()
  user_id: number;
 

  @ManyToOne(() => ProductModel, product => product.wishlistItems, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: ProductModel;

  @Column()
  product_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}