import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
   TableForeignKey, 
   OneToMany, 
   JoinTable, 
   ManyToMany, 
   ManyToOne} from "typeorm";
import Permission from "./PermissionModel";
@Entity({'name': 'roles'})
export default class Role {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(() => Permission, { eager: true }) 
    @JoinTable({
        name: "role_permissions", 
        joinColumn: { name: "role_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
    })
    permissions: Permission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    constructor(user: Partial<Role>) {
        Object.assign(this, user);
      }
}