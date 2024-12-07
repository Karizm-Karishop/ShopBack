import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import UserModel from './UserModel';

@Entity('books')
class BookModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookName: string;

  @Column()
  bookTitle: string;

  @Column()
  authorFirstName: string;

  @Column()
  authorLastName: string;

  @Column({ type: 'date', nullable: true })
  publishedDate: string;

  @Column({ nullable: true })
  coverImage: string;
  
  @Column({ nullable: true })
  uploadFile:string

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column('int')
  yearOfPublish: number;

  @Column('int')
  pageNumber: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => UserModel, (user) => user.books, {
    nullable: false
  })
  @JoinColumn({ name: 'artist_id' })
  artist: UserModel;
}

export default BookModel;