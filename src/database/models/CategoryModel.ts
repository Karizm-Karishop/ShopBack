import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import ShopModel from './ShopModel';
import { ProductModel } from './ProductModel';
import UserModel from './UserModel';
@Entity('categories')
export default class CategoryModel {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  category_name: string;
  
  @Column()
  description: string;

  @Column()
  category_icon: string;

  @OneToMany(() => ShopModel, (shop) => shop.category)
  shops: ShopModel[];

  @OneToMany(() => ProductModel, (product) => product.category)
  products: ProductModel[];

  @ManyToOne(() => UserModel, user => user.categories)
  @JoinColumn({ name: 'artist_id' })
  artist: UserModel;
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}