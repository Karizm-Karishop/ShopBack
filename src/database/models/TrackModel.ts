import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import AlbumModel from './AlbumModel';

@Entity('tracks')
class TrackModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  artist: string;  

  @Column({ nullable: true })
  genre: string;

  @Column({ type: 'date', nullable: true })
  release_date: Date;

  @Column({ nullable: true })
  description: string; 

  @Column({ nullable: true })
  media_url: string;  

  @ManyToOne(() => AlbumModel, (album) => album.tracks, {
    onDelete: 'CASCADE'
  })
  album: AlbumModel; 
}

export default TrackModel;
