import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("attendance_log")
export class AttendanceLog {
  @PrimaryGeneratedColumn()
  atlid: number;

  @Column({ type: "varchar", length: 25, default: "" })
  attendance_date: string;

  @Column({ type: "int", default: 0 })
  uid: number;

  @Column({ type: "varchar", length: 25, default: "" })
  app_id: string;

  @Column({ type: "varchar", length: 75, default: "" })
  atimage: string;

  @Column({ type: "int", default: 0 })
  atldate: number;

  @ManyToOne(() => User, (user) => user.attendanceLogs)
  @JoinColumn({ name: "uid" })
  user: User;
}
