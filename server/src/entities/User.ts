import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Post } from './Post';
import { Connection } from './Connection';
import { PortfolioItem } from './PortfolioItem';
import { MeetingRequest } from './MeetingRequest';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  role: 'realtor' | 'contractor';

  @Column({ nullable: true })
  photo: string;

  @Column()
  company: string;

  @Column({ nullable: true })
  specialty: string;

  @Column('simple-array', { nullable: true })
  specialties: string[];

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  yearsExperience: number;

  @Column('simple-array', { nullable: true })
  certifications: string[];

  @Column({ type: 'float', nullable: true })
  rating: number;

  @Column({ type: 'jsonb', nullable: true })
  availability: {
    workingHours: { start: string; end: string };
    workingDays: number[];
    meetingDuration: number;
    bookedSlots: {
      date: string;
      startTime: string;
      endTime: string;
      realtorId: string;
      status: 'confirmed' | 'pending';
      notes?: string;
    }[];
  };

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Connection, connection => connection.user)
  connections: Connection[];

  @OneToMany(() => PortfolioItem, portfolio => portfolio.user)
  portfolio: PortfolioItem[];

  @OneToMany(() => MeetingRequest, meeting => meeting.user)
  pendingMeetings: MeetingRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 