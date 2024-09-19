import { Entity, PrimaryGeneratedColumn, Column, Unique, Index } from 'typeorm';
import * as bcrypt from 'bcryptjs';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  @Index()
  @Unique('IDX_UNIQUE_USERNAME', ['username'])
  username: string;

  @Column({ length: 100, nullable: false })
  @Index()
  @Unique('IDX_UNIQUE_EMAIL', ['email'])
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ name: 'first_name', length: 50, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', length: 50, nullable: false })
  lastName: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'failed_attempts', default: 0 })
  failedAttempts: number;

  @Column({ name: 'login_count', default: 0 })
  loginCount: number;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'email_verification_token', length: 100, nullable: true })
  emailVerificationToken: string;

  @Column({ name: 'email_verification_token_expiry', type: 'timestamp', nullable: true })
  emailVerificationTokenExpiry: Date;

  @Column({ name: 'salt', default: '10' })
  salt: string

  @Column({ name: 'token_salt', default: '22' })
  tokenSalt: string

  async addPassword(pepper: string): Promise<void> {
    this.salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password + pepper, this.salt);
  }

  async validatePassword(password: string, pepper: string): Promise<boolean> {
    const hash: string = await bcrypt.hash(password + pepper, this.salt);
    return hash === this.password;
  }

  async generateEVToken(): Promise<void> {
    this.tokenSalt = await bcrypt.genSalt(10);
    this.emailVerificationTokenExpiry = new Date(Date.now() + (15 * 60 * 1000));
    this.emailVerificationToken = await bcrypt.hash(this.email, this.tokenSalt);
  }

  async verifyEVToken(token: string): Promise<boolean> {
    const hash: string = await bcrypt.hash(this.email, this.tokenSalt);
    const isValidToken: boolean = hash === token;
    if (isValidToken && this.emailVerificationTokenExpiry > new Date()) {
      this.emailVerificationToken = null
      this.emailVerificationTokenExpiry = null
      this.emailVerified = true
      return true
    } else {
      return false
    }

  }
}