import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.posts)
  user: User;

  @Column()
  content: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ nullable: true })
  projectId: string;

  @Column()
  type: 'project-update' | 'certification' | 'general' | 'project-showcase';

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @Column('simple-array', { default: [] })
  likes: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 