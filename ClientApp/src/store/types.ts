import { User } from '../models/User';

export interface RootState {
    version: string;
    isLogined: boolean;
    user: User;
}
