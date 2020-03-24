import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';

import { UserMiddleware } from './user.middleware';
import { InitMiddleware } from './init.middleware';

const AllMiddleware = [
  helmet(),
  csurf(),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
  InitMiddleware,
  UserMiddleware,
];

export { AllMiddleware };
