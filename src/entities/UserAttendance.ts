import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("user_attendance")
export class UserAttendance {
  @PrimaryGeneratedColumn()
  uatid: number;

  @Column({ type: "int", default: 0 })
  uid: number;

  @Column({ type: "int", default: 0 })
  asid: number;

  @Column({ type: "varchar", length: 15, default: "" })
  attendance_date: string;

  @Column({ type: "varchar", length: 10, default: "0:00" })
  store_starttime: string;

  @Column({ type: "varchar", length: 10, default: "0:00" })
  store_offtime: string;

  @Column({ type: "int", default: 0 })
  timein: number;

  @Column({ type: "varchar", length: 75, default: "" })
  timein_lat: string;

  @Column({ type: "varchar", length: 75, default: "" })
  timein_long: string;

  @Column({ type: "varchar", length: 75, default: "" })
  timein_image: string;

  @Column({ type: "int", default: 0 })
  timeout: number;

  @Column({ type: "varchar", length: 75, default: "" })
  timeout_lat: string;

  @Column({ type: "varchar", length: 75, default: "" })
  timeout_long: string;

  @Column({ type: "varchar", length: 75, default: "" })
  timeout_image: string;

  @Column({ type: "tinyint", default: 0 })
  stock_status: number;

  @Column({ type: "tinyint", default: 0 })
  price_status: number;

  @Column({ type: "tinyint", default: 0 })
  sale_status: number;

  @Column({ type: "tinyint", default: 0 })
  usership_status: number;

  @Column({ type: "tinyint", default: 0 })
  comsale_status: number;

  @Column({ type: "tinyint", default: 0 })
  deals_sold_status: number;

  @Column({ type: "tinyint", default: 0 })
  samples_status: number;

  @Column({ type: "varchar", length: 255, default: "None" })
  uatdeals_title: string;

  @Column({ type: "int", default: 0 })
  uatdeals: number;

  @Column({ type: "varchar", length: 255, default: "None" })
  uatsamples_title: string;

  @Column({ type: "int", default: 0 })
  uatsamples: number;

  @Column({ type: "varchar", length: 255, default: "" })
  uatremarks: string;

  @Column({ type: "varchar", length: 5, default: " " })
  uatcode: string;

  @Column({ type: "varchar", length: 3, default: " " })
  uatvalue: string;

  @Column({ type: "varchar", length: 255, default: " " })
  uatcomments: string;

  @Column({ type: "varchar", length: 15, default: "0" })
  total_hrs: string;

  @Column({ type: "varchar", length: 75, default: "" })
  uatapp_id: string;

  @Column({ type: "tinyint", default: 0 })
  uatstatus: number;

  @Column({ type: "int", default: 0 })
  uatdate: number;

  @ManyToOne(() => User, (user) => user.attendances)
  @JoinColumn({ name: "uid" })
  user: User;
}
