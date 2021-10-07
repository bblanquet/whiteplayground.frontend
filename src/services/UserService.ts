import { Token } from '../common/model/Token';
import { User } from '../common/model/User';
import { LiteEvent } from '../tools/events/LiteEvent';
import { IUserService } from './IUserService';

export class UserService implements IUserService {
	private user: User;
	private key: string = 'whiteplayground';
	public onTokenChanged: LiteEvent<Boolean> = new LiteEvent<Boolean>();

	constructor() {
		this.load();
	}

	public hasToken(): boolean {
		return this.user && this.user.token && this.user.token.IsValid();
	}
	public setToken(name: string, token: string): void {
		this.user.token = new Token(token);
		this.user.name = name;
		this.save();
		this.onTokenChanged.Invoke(this, true);
	}
	public getUser(): User {
		return this.user;
	}

	public clear(): void {
		this.user = new User();
		this.save();
		this.onTokenChanged.Invoke(this, false);
	}

	private load(): void {
		let newUser: User = null;
		const storedUser = JSON.parse(window.localStorage.getItem(this.key) as string);
		if (storedUser) {
			newUser = storedUser as User;
		} else {
			newUser = new User();
		}
		this.setUser(newUser);
	}

	private setUser(value: User): void {
		if (value.token && value.token.data) {
			value.token = new Token(value.token.data);
		}
		this.user = value;
	}

	public save(): void {
		window.localStorage.setItem(this.key, JSON.stringify(this.user));
	}
}
