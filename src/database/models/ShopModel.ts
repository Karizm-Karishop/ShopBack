import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import CategoryModel from './CategoryModel';
import { ProductModel } from './ProductModel';
import UserModel from './UserModel';
@Entity()
export default class ShopModel {
  @PrimaryGeneratedColumn()
  shop_id: number;

  @Column()
  shop_name: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  rating: number;

  @Column({default:'Active'})
  status: "Active" | "Inactive"

  @Column({nullable: true})
  address: string;

  @Column({nullable: true})
  banner: string;

  @Column({nullable: true})
  contact: string;

  @Column({default:"09:00 AM",nullable: true})
  opening_hours: string;

  @Column({ default: 0 })
  orders: number;

  @Column({ default: 0 })
  views: number;

  @ManyToOne(() => CategoryModel, (category) => category.shops)
  category: CategoryModel;

  @OneToMany(() => ProductModel, (product) => product.shop)
  products: ProductModel[];

  @ManyToOne(() => UserModel, (user) => user.shops, { onDelete: 'CASCADE' }) // New relation
  artist: UserModel;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

