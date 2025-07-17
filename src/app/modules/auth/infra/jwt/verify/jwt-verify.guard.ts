import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtVerifyGuard extends AuthGuard('jwt-verify') {}
