import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OptionalAuth, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @OptionalAuth()
  async login(@Session() session: UserSession) {}
}
