import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginDTO } from '@dtos/auth/login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'To login and generate access token',
    operationId: 'auth',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req: any, @Body() loginDto: LoginDTO) {
    const token = await this.authService.login(req.user);
    return token;
  }
}
