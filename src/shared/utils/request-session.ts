import { Request } from 'express';
import { Session } from '@core/user/domain/entities/session';

export type RequestSession = Request & {
  user: Session;
};
