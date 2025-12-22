import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Assignment } from "./Assignment";

@Entity("assignment_detail")
export class AssignmentDetail {
  @PrimaryGeneratedColumn()
  asdid: number;

  @Column({ type: "int", default: 0 })
  asid: number;

  @Column({ type: "int", default: 0 })
  brid: number;

  @Column({ type: "int", default: 0 })
  pid: number;

  @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
  asdtarget: number;

  @Column({ type: "tinyint", default: 0 })
  asdstatus: number;

  @Column({ type: "int", default: 0 })
  asddate: number;

  @ManyToOne(() => Assignment, (assignment) => assignment.details)
  @JoinColumn({ name: "asid" })
  assignment: Assignment;
}
