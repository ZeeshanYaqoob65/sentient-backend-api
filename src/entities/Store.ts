import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Assignment } from "./Assignment";

@Entity("store")
export class Store {
  @PrimaryGeneratedColumn()
  stid: number;

  @Column({ type: "varchar", length: 75, default: " " })
  store_code: string;

  @Column({ type: "varchar", length: 255, default: " " })
  store_name: string;

  @Column({ type: "varchar", length: 255, default: " " })
  store_address: string;

  @Column({ type: "varchar", length: 255, default: " " })
  unique_name: string;

  @Column({ type: "varchar", length: 255, default: " " })
  area: string;

  @Column({ type: "varchar", length: 255, default: " " })
  city: string;

  @Column({ type: "varchar", length: 150, default: " " })
  chain_store: string;

  @Column({ type: "varchar", length: 15, default: " " })
  channel: string;

  @Column({ type: "varchar", length: 150, default: " " })
  stcategory: string;

  @Column({ type: "tinyint", default: 0 })
  noc: number;

  @Column({ type: "tinyint", default: 0 })
  ba_card: number;

  @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
  charges: number;

  @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
  amount: number;

  @Column({ type: "varchar", length: 100, default: " " })
  stlat: string;

  @Column({ type: "varchar", length: 100, default: " " })
  stlong: string;

  @Column({ type: "varchar", length: 75, default: "0:00" })
  open_time: string;

  @Column({ type: "varchar", length: 75, default: "0:00" })
  close_time: string;

  @Column({ type: "varchar", length: 255, default: " " })
  off_day: string;

  @Column({ type: "varchar", length: 75, default: "0:00" })
  break_from: string;

  @Column({ type: "varchar", length: 75, default: "0:00" })
  break_to: string;

  @Column({ type: "varchar", length: 25, default: " " })
  uniform: string;

  @Column({ type: "varchar", length: 15, default: " " })
  scarf: string;

  @Column({ type: "varchar", length: 15, default: " " })
  badge: string;

  @Column({ type: "varchar", length: 15, default: " " })
  data_sheet: string;

  @Column({ type: "varchar", length: 15, default: " " })
  device: string;

  @Column({ type: "varchar", length: 15, default: " " })
  store_card: string;

  @Column({ type: "tinyint", default: 0 })
  ststatus: number;

  @Column({ type: "int", default: 0 })
  stdate: number;

  @OneToMany(() => Assignment, (assignment) => assignment.store)
  assignments: Assignment[];
}
