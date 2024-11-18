import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ProductModel } from './ProductModel';
import UserModel from './UserModel';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserModel, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column()
  user_id: number;

  @ManyToOne(() => ProductModel, product => product.cartItems, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: ProductModel;

  @Column()
  product_id: number;

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}