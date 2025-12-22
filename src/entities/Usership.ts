import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UsershipDetail } from "./UsershipDetail";

@Entity("usership")
export class Usership {
  @PrimaryGeneratedColumn()
  asuid: number;

  @Column({ type: "int", default: 0 })
  uid: number;

  @Column({ type: "int", default: 0 })
  asid: number;

  @Column({ type: "int", default: 0 })
  brid: number;

  @Column({ type: "varchar", length: 15, default: " " })
  sale_date: string;

  @Column({ type: "tinyint", default: 0 })
  sale_status: number;

  @Column({ type: "tinyint", default: 0 })
  asustatus: number;

  @Column({ type: "int", default: 0 })
  asudate: number;

  @OneToMany(() => UsershipDetail, (detail) => detail.usership)
  details: UsershipDetail[];
}
