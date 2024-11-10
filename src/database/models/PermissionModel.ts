import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";
@Entity({'name':'permissions'})
export default class Permission{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}