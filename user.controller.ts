import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { CreateUserDto } from '@dtos/user/createUser.dto';
import { UserService } from './user.service';
import { CreatedUserDto } from '@dtos/user/createdUser.dto';
import { TokenQueryDto } from '@dtos/user/tokenQuery.dto';
import { GetUserPipe } from '@pipes/getUser.pipe';
import { User } from '@entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
// import { Request } from 'express';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user', operationId: 'createUser' })
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<CreatedUserDto> {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email token', operationId: 'verifyEmail' })
  async verifyEmail(
    @Query() tokenQuery: TokenQueryDto,
    @Query('username', GetUserPipe) user: User
  ): Promise<string> {
    const isValidEmail = await this.userService.verifyToken(tokenQuery, user);
    return isValidEmail ? 'Successfully verified email' : 'Invalid URL';
  }

  @Get(':username')
  @ApiOperation({
    summary: 'Get details of specific user',
    operationId: 'getUser'
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'username', required: true, type: String })
  getUserDetails(@Req() req: any) {
    const { user } = req;
    const { username, email, firstName, lastName } = user as User;
    return { username, email, firstName, lastName };
  }
}
