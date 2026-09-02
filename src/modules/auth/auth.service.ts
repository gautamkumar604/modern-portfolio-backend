import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import type { Response } from 'express';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  private getCookieOptions() {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    const cookieSecureConfig = this.configService.get<boolean>('cookieSecure');
    const cookieSecureEnv = this.configService.get<string>('COOKIE_SECURE');

    let secure = false;
    if (cookieSecureEnv !== undefined && cookieSecureEnv !== '') {
      secure = cookieSecureEnv === 'true';
    } else if (cookieSecureConfig !== undefined) {
      secure = cookieSecureConfig;
    } else {
      secure = isProd;
    }

    const cookieSameSiteConfig = this.configService.get<string>('cookieSameSite');
    const cookieSameSiteEnv = this.configService.get<string>('COOKIE_SAME_SITE');

    const envSameSite = (cookieSameSiteConfig || cookieSameSiteEnv || '') as string;
    let sameSite: 'lax' | 'strict' | 'none' = 'lax';

    if (['lax', 'strict', 'none'].includes(envSameSite)) {
      sameSite = envSameSite as 'lax' | 'strict' | 'none';
    } else {
      sameSite = secure ? 'none' : 'lax';
    }

    // Browsers reject SameSite=None if Secure is false (e.g. unencrypted HTTP).
    if (!secure && sameSite === 'none') {
      sameSite = 'lax';
    }

    return {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    };
  }

  async login(loginDto: LoginDto, response: Response) {
    const { email, password } = loginDto;

    // Find user by email and explicitly include select:false passwordHash
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+passwordHash')
      .exec();

    if (!user) {
      this.logger.warn(`Failed login attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      this.logger.warn(`Login attempt for inactive account: ${email}`);
      throw new UnauthorizedException('Account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for email: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Attach HttpOnly cookie to response
    response.cookie('access_token', accessToken, this.getCookieOptions());

    return {
      message: 'Login successful',
      token: accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(response: Response) {
    response.clearCookie('access_token', this.getCookieOptions());
    return { message: 'Logout successful' };
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or account is inactive');
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
    };
  }
}
