import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Assignment } from "./Assignment";
import { Product } from "./Product";

@Entity("brand")
export class Brand {
  @PrimaryGeneratedColumn()
  brid: number;

  @Column({ type: "int", default: 0 })
  cid: number;

  @Column({ type: "varchar", length: 75, default: " " })
  company_name: string;

  @Column({ type: "varchar", length: 255, default: " " })
  brname: string;

  @Column({ type: "tinyint", default: 0 })
  brstatus: number;

  @Column({ type: "int", default: 0 })
  brdate: number;

  @OneToMany(() => Assignment, (assignment) => assignment.brand)
  assignments: Assignment[];

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
