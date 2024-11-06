import { 
    Entity, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne 
  } from 'typeorm';
  import { ProductModel } from './ProductModel';
  import UserModel from './UserModel';
  @Entity('wishlists')
  export class WishlistItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => UserModel)
    user: UserModel;
  
    @ManyToOne(() => ProductModel, product => product.wishlistItems)
    product: ProductModel;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }