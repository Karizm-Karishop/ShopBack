import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import UserModel from './UserModel'; 
  
  export enum NotificationType {
    CONTACT = 'Contact',
    SUBSCRIPTION = 'Subscription',
    PRODUCT = 'Product',
    SYSTEM = 'System'
  }
  
  export enum NotificationStatus {
    READ = 'read',
    UNREAD = 'unread'
  }
  
  export enum NotificationPriority {
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low'
  }
  
  interface NotificationDetails {
    sender?: string;
    email?: string;
    subject?: string;
    content?: string;
  }
  
  @Entity('notifications')
  export class NotificationModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({
      type: 'enum',
      enum: NotificationType,
      nullable: false
    })
    type: NotificationType;
  
    @Column('text')
    message: string;
  
    @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    })
    dateReceived: Date;
  
    @Column({
      type: 'enum',
      enum: NotificationStatus,
      default: NotificationStatus.UNREAD
    })
    status: NotificationStatus;
  
    @Column({
      type: 'enum',
      enum: NotificationPriority,
      default: NotificationPriority.MEDIUM
    })
    priority: NotificationPriority;
  
    @Column({
      type: 'jsonb',
      nullable: true
    })
    details: NotificationDetails;
  
    @Column('boolean', { 
      default: false 
    })
    isDeleted: boolean;
  
    @ManyToOne(() => UserModel, user => user.notifications, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: UserModel;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    constructor(partial: Partial<NotificationModel>) {
      Object.assign(this, partial);
    }
  }
  
  export default NotificationModel;