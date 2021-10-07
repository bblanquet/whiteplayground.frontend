import { Hook } from '../utils/Hook';
import { StateUpdater } from 'preact/hooks';
import { InfoState } from '../model/InfoState';
import { IApiService } from '../../services/IApiService';
import { Singletons, SingletonKey } from '../../tools/singleton/Singletons';
import { Wallet } from '../../common/model/Wallet';
import { LogKind } from '../../tools/logger/LogKind';
import { RequestState } from '../model/RequestState';
import { RequestedList } from '../model/RequestedList';
import { INotificationService } from '../../services/INotificationService';

export class WalletListHook extends Hook<RequestedList<Wallet>> {
	private apiSvc: IApiService;
	private notificationSvc: INotificationService;

	constructor(
		private callBack: (c: string) => void,
		d: [RequestedList<Wallet>, StateUpdater<RequestedList<Wallet>>]
	) {
		super(d[0], d[1]);
		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.notificationSvc = Singletons.Load<INotificationService>(SingletonKey.notification);

		this.fetch();
	}

	private fetch() {
		this.update((e) => {
			e.RequestState = RequestState.LOADING;
		});
		this.apiSvc.get<void, Array<Wallet>>(
			'account/list',
			null,
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

	public delete(ccy: string): void {
		this.update((e) => {
			e.RequestState = RequestState.LOADING;
		});
		this.apiSvc.delete<{ currency: string }, string>(
			'account/delete',
			{ currency: ccy },
			(r) => {
				this.fetch();
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

	static defaultState(): RequestedList<Wallet> {
		const g = new RequestedList<Wallet>();
		return g;
	}

	public details(currency: string): void {
		this.callBack(currency);
	}

	protected stateChanged(): void {}

	public unmount(): void {}
}
