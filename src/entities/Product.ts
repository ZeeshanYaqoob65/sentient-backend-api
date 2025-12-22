import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Brand } from "./Brand";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  pid: number;

  @Column({ type: "int", default: 0 })
  brid: number;

  @Column({ type: "int", default: 0 })
  cid: number;

  @Column({ type: "varchar", length: 255, default: "" })
  pname: string;

  @Column({ type: "varchar", length: 150, default: "" })
  sku: string;

  @Column({ type: "varchar", length: 35, default: "" })
  ptype: string;

  @Column({ type: "varchar", length: 35, default: "" })
  psize: string;

  @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
  pprice: number;

  @Column({ type: "varchar", length: 35, default: "" })
  unit_type: string;

  @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
  pweight: number;

  @Column({ type: "tinyint", default: 0 })
  pstatus: number;

  @Column({ type: "int", default: 0 })
  pdate: number;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: "brid" })
  brand: Brand;
}
