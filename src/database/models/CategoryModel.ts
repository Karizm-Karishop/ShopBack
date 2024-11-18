import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import ShopModel from './ShopModel';
import { ProductModel } from './ProductModel';

@Entity()
export default class CategoryModel {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  category_name: string;
  
  @Column()
  description: string;

  @OneToMany(() => ShopModel, (shop) => shop.category)
  shops: ShopModel[];

  @OneToMany(() => ProductModel, (product) => product.category)
  products: ProductModel[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}