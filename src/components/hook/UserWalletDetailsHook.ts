import { Hook } from '../utils/Hook';
import { StateUpdater } from 'preact/hooks';
import { InfoState } from '../model/InfoState';
import { IApiService } from '../../services/IApiService';
import { Singletons, SingletonKey } from '../../tools/singleton/Singletons';
import { LogKind } from '../../tools/logger/LogKind';
import { RequestState } from '../model/RequestState';
import { INotificationService } from '../../services/INotificationService';
import { UserWalletDetailsState } from '../model/UserWalletDetailsState';
import { Deal } from '../../common/model/Deal';

export class UserWalletDetailsHook extends Hook<UserWalletDetailsState> {
	private apiSvc: IApiService;
	private notificationSvc: INotificationService;
	constructor(d: [UserWalletDetailsState, StateUpdater<UserWalletDetailsState>]) {
		super(d[0], d[1]);

		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.notificationSvc = Singletons.Load<INotificationService>(SingletonKey.notification);
		this.fetch();
	}

	public isAsset(r: Deal) {
		return 'deposit' === r.kind || (r.kind === 'transfer' && 0 < r.amount);
	}

	private fetch() {
		this.update((e) => {
			e.RequestState = RequestState.LOADING;
		});

		this.apiSvc.get<{ currency: string }, Array<Deal>>(
			'account/details',
			{ currency: this.state.currency },
			(r) => {
				this.update((e) => {
					e.data = r;
					e.RequestState = RequestState.LOADED;
				});
			},
			(e) => {
				this.update((e) => {
					e.RequestState = RequestState.ERROR;
				});
				this.notificationSvc.onNotification.Invoke(
					this,
					new InfoState(LogKind.error, `${e.name} - ${e.description}`)
				);
			}
		);
	}

	setCcy(currency: string) {
		this.update((e) => {
			e.currency = currency;
		});
		this.fetch();
	}

	static defaultState(ccy: string): UserWalletDetailsState {
		const g = new UserWalletDetailsState();
		g.data = new Array<Deal>();
		g.currency = ccy;
		return g;
	}

	protected stateChanged(): void {}

	public unmount(): void {}
}
