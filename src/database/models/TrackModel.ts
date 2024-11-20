import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column('jsonb', { nullable: true })
  metadata: {
    file: {
      url: string;
      originalName: string;
      mimetype: string;
      size: number;
    };
    artistName: string;
  };

  @ManyToOne(() => AlbumModel, (album) => album.tracks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  album: AlbumModel;
}

export default TrackModel;