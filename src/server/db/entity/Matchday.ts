import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Matchday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column()
  teams: string;

  @Column()
  competition: string;
}
