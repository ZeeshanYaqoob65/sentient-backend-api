import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Assignment } from "./Assignment";
import { AttendanceLog } from "./AttendanceLog";
import { UserAttendance } from "./UserAttendance";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column({ type: "int", default: 0 })
  lid: number;

  @Column({ type: "int", default: 0 })
  utype: number; // 3 = Supervisor, 4 = BA

  @Column({ type: "int", default: 0 })
  su_no: number;

  @Column({ type: "tinyint", default: 0 })
  su_attendance: number;

  @Column({ type: "varchar", length: 11, default: "0" })
  ba_no: string;

  @Column({ type: "varchar", length: 50, default: "" })
  username: string;

  @Column({ type: "varchar", length: 255, default: "" })
  password: string;

  @Column({ type: "varchar", length: 150, default: "" })
  market_name: string;

  @Column({ type: "varchar", length: 150, default: "" })
  father_name: string;

  @Column({ type: "varchar", length: 150, default: "" })
  fullname: string;

  @Column({ type: "varchar", length: 150, default: "" })
  adopted_name: string;

  @Column({ type: "varchar", length: 75, default: "" })
  email: string;

  @Column({ type: "varchar", length: 50, default: "" })
  mobileno1: string;

  @Column({ type: "varchar", length: 50, default: "" })
  mobileno2: string;

  @Column({ type: "varchar", length: 50, default: "" })
  mobileno3: string;

  @Column({ type: "varchar", length: 50, default: "" })
  emergencyno: string;

  @Column({ type: "varchar", length: 75, default: "" })
  education: string;

  @Column({ type: "varchar", length: 75, default: "" })
  skills: string;

  @Column({ type: "varchar", length: 75, default: "" })
  marketing_exp: string;

  @Column({ type: "tinyint", default: 0 })
  covid_cert: number;

  @Column({ type: "varchar", length: 50, default: "" })
  marital_status: string;

  @Column({ type: "varchar", length: 75, default: "" })
  user_image: string;

  @Column({ type: "varchar", length: 150, default: "" })
  image1: string;

  @Column({ type: "varchar", length: 150, default: "" })
  image2: string;

  @Column({ type: "longtext", default: "" })
  permanentaddress: string;

  @Column({ type: "varchar", length: 50, default: "" })
  cnic_no: string;

  @Column({ type: "varchar", length: 150, default: "" })
  cnic_front: string;

  @Column({ type: "varchar", length: 150, default: "" })
  cnic_back: string;

  @Column({ type: "varchar", length: 255, default: "" })
  address: string;

  @Column({ type: "varchar", length: 150, default: "" })
  area: string;

  @Column({ type: "varchar", length: 150, default: "" })
  city: string;

  @Column({ type: "varchar", length: 150, default: "" })
  dob: string;

  @Column({ type: "varchar", length: 150, default: "" })
  religion: string;

  @Column({ type: "varchar", length: 150, default: "" })
  cnic_image: string;

  @Column({ type: "tinyint", default: 0 })
  imtiaz_work: number;

  @Column({ type: "varchar", length: 150, default: "" })
  imtiaz_noc: string;

  @Column({ type: "varchar", length: 150, default: "" })
  bank_iban: string;

  @Column({ type: "varchar", length: 150, default: "" })
  bank_name: string;

  @Column({ type: "tinyint", default: 0 })
  blacklist_status: number;

  @Column({ type: "varchar", length: 255, default: "" })
  blacklist_reason: string;

  @Column({ type: "varchar", length: 150, default: "" })
  baform_image: string;

  @Column({ type: "varchar", length: 255, default: "" })
  leave_reason: string;

  @Column({ type: "int", default: 0 })
  dol: number;

  @Column({ type: "varchar", length: 75, default: "" })
  app_id: string;

  @Column({ type: "tinyint", default: 0 })
  ustatus: number; // 0 = Active, 1 = Inactive

  @Column({ type: "int", default: 0 })
  udate: number;

  @OneToMany(() => Assignment, (assignment) => assignment.user)
  assignments: Assignment[];

  @OneToMany(() => UserAttendance, (attendance) => attendance.user)
  attendances: UserAttendance[];

  @OneToMany(() => AttendanceLog, (log) => log.user)
  attendanceLogs: AttendanceLog[];
}
