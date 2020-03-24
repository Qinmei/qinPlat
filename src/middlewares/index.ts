import { UserMiddleware } from './user.middleware';
import { InitMiddleware } from './init.middleware';

const AllMiddleware = [InitMiddleware, UserMiddleware];

export { InitMiddleware, UserMiddleware, AllMiddleware };
