import { HomeState } from '../model/HomeState';
import { Hook } from '../utils/Hook';
import { StateUpdater } from 'preact/hooks';
import { PageStatus } from '../model/PageStatus';
import { IUserService } from '../../services/IUserService';
import { SingletonKey, Singletons } from '../../tools/singleton/Singletons';

export class HomeHook extends Hook<HomeState> {
	private userSvc: IUserService;
	constructor(d: [HomeState, StateUpdater<HomeState>]) {
		super(d[0], d[1]);
		this.userSvc = Singletons.Load<IUserService>(SingletonKey.user);
		this.userSvc.onTokenChanged.On(this.handleTokenChanged.bind(this));
	}

	private handleTokenChanged(src: object, value: boolean): void {
		this.update((e) => {
			e.hasToken = value;
		});
	}

	static defaultState(): HomeState {
		var usrSvc = Singletons.Load<IUserService>(SingletonKey.user);
		const g = new HomeState();
		g.status = PageStatus.home;
		g.hasToken = usrSvc.hasToken();
		return g;
	}

	public setStatus(status: PageStatus): void {
		this.update((e) => {
			e.status = status;
		});
	}

	protected stateChanged(): void {}

	public unmount(): void {}
}
