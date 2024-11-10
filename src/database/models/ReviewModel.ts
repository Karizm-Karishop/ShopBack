import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
// import Product from "./ProductModel";
import User from "./UserModel";

@Entity('reviews')
export default class Review {
    @PrimaryGeneratedColumn()
    review_id: number;

    // @ManyToOne(() => Product, product => product.product_id)
    // product_id: Product;

    @ManyToOne(() => User, user => user.user_id)
    user_id: User;

    @Column()
    rating: number;

    @Column({ type: "text" })
    comment: string;

    @Column({ default: new Date() })
    review_date: Date;
}
