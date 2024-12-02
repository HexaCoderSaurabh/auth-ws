import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginDTO } from '@dtos/auth/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Response, Request } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'To login and generate access token',
    operationId: 'auth'
  })
  @ApiBody({ type: LoginDTO })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req: any, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user
    );
    res.cookie('access_token', accessToken, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Set cookie as secure in production
      sameSite: 'strict', // Prevent cross-site request forgery
      maxAge: 24 * 3600 * 1000 // Cookie expiration time (2 hour in milliseconds)
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Set cookie as secure in production
      sameSite: 'strict', // Prevent cross-site request forgery
      maxAge: 7 * 24 * 3600 * 1000 // Cookie expiration time (7 days in milliseconds)
    });

    return res
      .status(HttpStatus.OK)
      .send({ message: 'Logged in successfully' });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } = await this.authService.refresh(
        req.cookies.refresh_token
      );

      res.cookie('access_token', accessToken, {
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Set cookie as secure in production
        sameSite: 'strict', // Prevent cross-site request forgery
        maxAge: 24 * 3600 * 1000 // Cookie expiration time (2 hour in milliseconds)
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Set cookie as secure in production
        sameSite: 'strict', // Prevent cross-site request forgery
        maxAge: 7 * 24 * 3600 * 1000 // Cookie expiration time (7 days in milliseconds)
      });

      return res
        .status(HttpStatus.OK)
        .send({ message: 'Refreshed token successfully' });
    } catch (error) {
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .send({ message: 'Invalid or expired refresh token' });
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.status(HttpStatus.OK).json({
      message: 'Logged out successfully'
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'To get user',
    operationId: 'authTest'
  })
  @HttpCode(HttpStatus.OK)
  @Post('userTest')
  async getUser(@Req() req: any) {
    return req.user;
  }
}
