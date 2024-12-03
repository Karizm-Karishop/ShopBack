import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn
  } from 'typeorm';
  import CategoryModel  from './CategoryModel';
  import ShopModel  from './ShopModel';
  import { OrderItem } from './OrderItem';
  import { WishlistItem } from './WishlistItem';
  import { CartItem } from './CartItem';
  import UserModel from './UserModel'
  
  @Entity('products')
  export class ProductModel {
    @PrimaryGeneratedColumn()
    product_id: number;

    @Column({ length: 255 })
    name: string;

    @Column('text')
    shortDesc: string;
    @Column('text')
    longDesc: string;

    @Column('text', { nullable: true })
    product_image: string | null;
    
    @Column('simple-array')
    gallery: string[];
  
    @Column('decimal', { precision: 10, scale: 2 })
    sales_price: number;
  
    @Column('decimal', { precision: 10, scale: 2 })
    regular_price: number;
  
    @Column('int')
    quantity: number;
    
    @Column({ default: true })
    isAvailable: boolean;
  
    @Column('simple-array')
    tags: string[];
  
    @ManyToOne(() => CategoryModel, category => category.products)
    category: CategoryModel;
  
    @ManyToOne(() => ShopModel, shop => shop.products)
    shop: ShopModel;
  
    @OneToMany(() => OrderItem, orderItem => orderItem.product)
    orderItems: OrderItem[];
  
    @OneToMany(() => CartItem, cartItem => cartItem.product)
    cartItems: CartItem[];
  
    @OneToMany(() => WishlistItem, wishlistItem => wishlistItem.product)
    wishlistItems: WishlistItem[];
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => UserModel, user => user.products)
    @JoinColumn({ name: 'artist_id' })
    artist: UserModel;
    
    
  }