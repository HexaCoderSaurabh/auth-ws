import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@dtos/user/createUser.dto';
import { User } from '@entities/user.entity';
import { Repository } from 'typeorm';
import { CreatedUserDto } from '@dtos/user/createdUser.dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { TokenQueryDto } from '@dtos/user/tokenQuery.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger('User Service');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneByIdOrUsername(emailOrUsername: string): Promise<User | null> {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username or user.email = :email', {
        username: emailOrUsername,
        email: emailOrUsername
      });

    const user = await query.getOne();
    return user;
  }

  async createUser(
    createUserDto: CreateUserDto
  ): Promise<CreatedUserDto | null> {
    try {
      const user = this.usersRepository.create({ ...createUserDto });
      const pepper = await this.configService.get<string>('PEPPER');

      await user.addPassword(pepper);
      await user.generateEVToken();

      const response = await this.usersRepository.save(user);
      this.logger.verbose('Successfully created user');
      await this.emailService.sendVerificationEmail(
        user.email,
        user.emailVerificationToken,
        user.username
      );
      const { id, username, email, password, firstName, lastName } = response;
      const responseData: CreatedUserDto = {
        id,
        username,
        email,
        password,
        firstName,
        lastName
      };
      return responseData;
    } catch (error) {
      this.logger.error('Error while creating user:', error);
      throw new BadRequestException({
        message: 'User creation failed',
        errors: error.message
      });
    }
  }

  async verifyToken(
    tokenQueryDTO: TokenQueryDto,
    user: User
  ): Promise<boolean> {
    let result: boolean = false;
    try {
      const { token } = tokenQueryDTO;
      result = await user.verifyEVToken(token);
      if (result) {
        await this.usersRepository.save(user);
      }
    } catch (error) {
      this.logger.error('Error while verifying token:', error);
      throw new BadRequestException({
        message: 'Token Verification Failed',
        errors: error.message
      });
    } finally {
      return result;
    }
  }

  async verifyPassword(username: string, password: string): Promise<boolean> {
    try {
      const user: User = await this.findOneByIdOrUsername(username);
      const valid = user.validatePassword(
        password,
        this.configService.get<string>('PEPPER')
      );
      return valid;
    } catch (error) {
      this.logger.error('Error while verifying password:', error);
      return false;
    }
  }
}
