import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../../shared/types';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { RegisterForm } from './dto/register.form';
import { LoginForm } from './dto/login.form';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() form: RegisterForm) {
    return this.auth.register(form);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() form: LoginForm) {
    return this.auth.login(form);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.auth.me(user.id);
  }
}
