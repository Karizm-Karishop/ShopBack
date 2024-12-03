import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import TrackModel from './TrackModel';
import UserModel from './UserModel';

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

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => TrackModel, (track) => track.album, {
    cascade: true,
    eager: true
  })
  tracks: TrackModel[];

  @ManyToOne(() => UserModel, (user) => user.albums, {
    nullable: false
  })
  @JoinColumn({ name: 'artist_id' })
  artist: UserModel;
}

export default AlbumModel;