import { User } from '../common/model/User';
import { LiteEvent } from '../tools/events/LiteEvent';

export interface IUserService {
	clear(): void;
	hasToken(): boolean;
	setToken(name: string, token: string): void;
	onTokenChanged: LiteEvent<Boolean>;
	getUser(): User;
}
