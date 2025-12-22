import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("cbrand")
export class CompetitorBrand {
  @PrimaryGeneratedColumn()
  cbrid: number;

  @Column({ type: "varchar", length: 100, default: "" })
  cbrname: string;

  @Column({ type: "tinyint", default: 0 })
  cbrstatus: number;

  @Column({ type: "int", default: 0 })
  cbrdate: number;
}
