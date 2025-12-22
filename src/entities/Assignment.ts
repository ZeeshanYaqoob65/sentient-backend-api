import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Store } from "./Store";
import { Brand } from "./Brand";
import { AssignmentDetail } from "./AssignmentDetail";
import { AssignmentSale } from "./AssignmentSale";

@Entity("assignments")
export class Assignment {
  @PrimaryGeneratedColumn()
  asid: number;

  @Column({ type: "int", default: 0 })
  stid: number;

  @Column({ type: "int", default: 0 })
  brid: number;

  @Column({ type: "int", default: 0 })
  uid: number;

  @Column({ type: "varchar", length: 35, default: "" })
  asshift: string;

  @Column({ type: "varchar", length: 35, default: "" })
  asoffday: string;

  @Column({ type: "varchar", length: 10, default: "00:00" })
  asbreaktime_from: string;

  @Column({ type: "varchar", length: 10, default: "00:00" })
  asbreaktime_to: string;

  @Column({ type: "varchar", length: 10, default: "00:00" })
  asstarttime: string;

  @Column({ type: "varchar", length: 10, default: "00:00" })
  asofftime: string;

  @Column({ type: "int", default: 0 })
  storetarget: number;

  @Column({ type: "int", default: 0 })
  supuid: number;

  @Column({ type: "int", default: 0 })
  sampletarget: number;

  @Column({ type: "int", default: 0 })
  dealtarget: number;

  @Column({ type: "tinyint", default: 0 })
  sample_status: number;

  @Column({ type: "tinyint", default: 0 })
  deal_status: number;

  @Column({ type: "int", default: 0 })
  distance_limit: number;

  @Column({ type: "int", default: 0 })
  unassign_date: number;

  @Column({ type: "varchar", length: 255, default: "" })
  vacant_remarks: string;

  @Column({ type: "tinyint", default: 0 })
  asstatus: number; // 0 = Active, 1 = Inactive

  @Column({ type: "int", default: 0 })
  asdate: number;

  @ManyToOne(() => User, (user) => user.assignments)
  @JoinColumn({ name: "uid" })
  user: User;

  @ManyToOne(() => Store, (store) => store.assignments)
  @JoinColumn({ name: "stid" })
  store: Store;

  @ManyToOne(() => Brand, (brand) => brand.assignments)
  @JoinColumn({ name: "brid" })
  brand: Brand;

  @OneToMany(() => AssignmentDetail, (detail) => detail.assignment)
  details: AssignmentDetail[];

  @OneToMany(() => AssignmentSale, (sale) => sale.assignment)
  sales: AssignmentSale[];
}
