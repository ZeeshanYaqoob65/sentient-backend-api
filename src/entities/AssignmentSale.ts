import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Assignment } from "./Assignment";

@Entity("assignment_sale")
export class AssignmentSale {
  @PrimaryGeneratedColumn()
  assid: number;

  @Column({ type: "int", default: 0 })
  uid: number;

  @Column({ type: "int", default: 0 })
  asdid: number;

  @Column({ type: "int", default: 0 })
  asid: number;

  @Column({ type: "int", default: 0 })
  brid: number;

  @Column({ type: "int", default: 0 })
  pid: number;

  @Column({ type: "varchar", length: 25, default: "" })
  sale_date: string;

  @Column({ type: "int", default: 0 })
  stock_qty: number;

  @Column({ type: "int", default: 0 })
  sale_price: number;

  @Column({ type: "int", default: 0 })
  sale_qty: number;

  @Column({ type: "int", default: 0 })
  sale_target: number;

  @Column({ type: "varchar", length: 2, default: "" })
  stock_type: string; // A, L, Z

  @Column({ type: "varchar", length: 75, default: "" })
  asslat: string;

  @Column({ type: "varchar", length: 75, default: "" })
  asslong: string;

  @Column({ type: "tinyint", default: 0 })
  assstatus: number;

  @Column({ type: "int", default: 0 })
  assdate: number;

  @ManyToOne(() => Assignment, (assignment) => assignment.sales)
  @JoinColumn({ name: "asid" })
  assignment: Assignment;
}
