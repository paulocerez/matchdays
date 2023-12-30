import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

// User can have many Football clubs

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  googleId: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => FootballClub, (club) => club.user)
  clubs: FootballClub[];
}
