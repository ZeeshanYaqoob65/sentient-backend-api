import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Usership } from "./Usership";

@Entity("usership_detail")
export class UsershipDetail {
  @PrimaryGeneratedColumn()
  asudid: number;

  @Column({ type: "int", default: 0 })
  asuid: number;

  @Column({ type: "int", default: 0 })
  uid: number;

  @Column({ type: "int", default: 0 })
  brid: number;

  @Column({ type: "int", default: 0 })
  cbrid: number;

  @Column({ type: "varchar", length: 15, default: " " })
  sale_date: string;

  @Column({ type: "int", default: 0 })
  interception: number;

  @Column({ type: "int", default: 0 })
  productive: number;

  @Column({ type: "int", default: 0 })
  com_sale: number;

  @Column({ type: "int", default: 0 })
  asusale: number;

  @Column({ type: "int", default: 0 })
  asuddate: number;

  @ManyToOne(() => Usership, (usership) => usership.details)
  @JoinColumn({ name: "asuid" })
  usership: Usership;
}
