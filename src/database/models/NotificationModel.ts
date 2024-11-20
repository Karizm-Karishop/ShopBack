import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import User from "./UserModel";

@Entity('notifications')
export default class Notification {
    @PrimaryGeneratedColumn()
    notification_id: number;

    @ManyToOne(() => User, user => user.user_id)
    user_id: User;

    @Column({ type: "text" })
    message: string;

    @Column({ default: false })
    is_read: boolean;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
