import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Support both plain-text passwords (legacy/local) and bcrypt hashed passwords (production)
        const isBcrypt = user.password.startsWith('$2b$') || user.password.startsWith('$2a$');
        const isPasswordValid = isBcrypt
          ? await bcrypt.compare(loginDto.password, user.password)
          : loginDto.password === user.password;

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
        };
    }
}
