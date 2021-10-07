import { Hook } from '../utils/Hook';
import { StateUpdater } from 'preact/hooks';
import { LoginState } from '../model/LoginState';
import { IApiService } from '../../services/IApiService';
import { SingletonKey, Singletons } from '../../tools/singleton/Singletons';
import { IUserService } from '../../services/IUserService';
import { INotificationService } from '../../services/INotificationService';
import { InfoState } from '../model/InfoState';
import { LogKind } from '../../tools/logger/LogKind';

export class LoginHook extends Hook<LoginState> {
	private apiSvc: IApiService;
	private userSvc: IUserService;
	private notificationSvc: INotificationService;

	constructor(d: [LoginState, StateUpdater<LoginState>]) {
		super(d[0], d[1]);
		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.userSvc = Singletons.Load<IUserService>(SingletonKey.user);
		this.notificationSvc = Singletons.Load<INotificationService>(SingletonKey.notification);
	}

	static defaultState(): LoginState {
		const g = new LoginState();
		var userSvc = Singletons.Load<IUserService>(SingletonKey.user);
		g.hasToken = userSvc.hasToken();
		return g;
	}

	public setUsername(value: string): void {
		this.update((e) => {
			e.username = value;
		});
	}

	public setPassword(value: string): void {
		this.update((e) => {
			e.password = value;
		});
	}

	public logOut(): void {
		this.userSvc.clear();
		this.update((e) => {
			e.hasToken = false;
			e.username = '';
			e.password = '';
		});
		this.notificationSvc.onNotification.Invoke(this, new InfoState(LogKind.info, `You are logged out`));
	}

	public getName(): string {
		return this.userSvc.getUser().name;
	}

	public hasToken(): boolean {
		return this.userSvc.hasToken();
	}

	public signIn(): void {
		this.apiSvc.post<LoginState, { token: string }>(
			'auth/signIn',
			this.state,
			(r) => {
				this.userSvc.setToken(this.state.username, r.token);
				this.update((e) => {
					e.hasToken = true;
				});
				this.notificationSvc.onNotification.Invoke(
					this,
					new InfoState(LogKind.info, `Welcome ${this.state.username}`)
				);
			},
			(e) => {
				this.notificationSvc.onNotification.Invoke(
					this,
					new InfoState(LogKind.error, `${e.name} - ${e.description}`)
				);
			}
		);
	}

	public signUp(): void {
		this.apiSvc.post<LoginState, { token: string }>(
			'auth/signUp',
			this.state,
			(r) => {
				this.userSvc.setToken(this.state.username, r.token);
				this.notificationSvc.onNotification.Invoke(
					this,
					new InfoState(LogKind.info, `Welcome ${this.state.username}`)
				);
			},
			(e) => {
				this.notificationSvc.onNotification.Invoke(
					this,
					new InfoState(LogKind.error, `${e.name} - ${e.description}`)
				);
			}
		);
	}

	protected stateChanged(): void {}

	public unmount(): void {}
}
