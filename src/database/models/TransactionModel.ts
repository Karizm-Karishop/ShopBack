import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import User from "./UserModel";
@Entity('transactions')
export default class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @ManyToOne(() => User, user => user.user_id,{eager:true})
    user_id: User;

    @Column({default:new Date()})
    transaction_date: Date;

    @Column()
    status: string;

    @Column()
    type:string;
}