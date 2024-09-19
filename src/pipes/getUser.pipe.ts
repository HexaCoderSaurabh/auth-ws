import { User } from '@entities/user.entity';
import {
  Injectable,
  Logger,
  NotFoundException,
  PipeTransform
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GetUserPipe
  implements PipeTransform<string, Promise<User | null>>
{
  private readonly logger = new Logger('GetUserPipe');

  constructor(private readonly userService: UserService) {}

  async transform(value: string): Promise<User | null> {
    try {
      const user = await this.userService.findOneByIdOrUsername(value);
      if (!user) {
        throw new NotFoundException(`User with ID ${value} not found`);
      }
      return user;
    } catch (err) {
      this.logger.error(`Error while fetching user with id ${value}`, err);
    }
    throw new NotFoundException(`User with ID ${value} not found`);
  }
}
