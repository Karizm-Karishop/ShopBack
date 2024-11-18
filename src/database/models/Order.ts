import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne,
    OneToMany 
  } from 'typeorm';
  import { OrderItem } from './OrderItem';
import UserModel from './UserModel';
  
  @Entity('orders')
  export class Order {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => UserModel)
    user: UserModel;
  
    @Column('decimal', { precision: 10, scale: 2 })
    total_amount: number;
  
    @Column({
      type: 'enum',
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    })
    status: string;
  
    @Column('text', { nullable: true })
    shipping_address: string;
  
    @Column('text', { nullable: true })
    billing_address: string;
  
    @Column('text', { nullable: true })
    payment_method: string;
  
    @Column('text', { nullable: true })
    tracking_number: string;
  
    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[];
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }