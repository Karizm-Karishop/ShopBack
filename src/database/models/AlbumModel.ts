import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import TrackModel from './TrackModel';

@Entity('albums')
class AlbumModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  album_title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  cover_image: string;

  @Column()
  media_type: 'audio' | 'video';

  @Column()
  is_multiple_upload: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => TrackModel, (track) => track.album, {
    cascade: true,
    eager: true
  })
  tracks: TrackModel[];
}

export default AlbumModel;