import { Hook } from '../utils/Hook';
import { StateUpdater } from 'preact/hooks';
import { InfoState } from '../model/InfoState';
import { IApiService } from '../../services/IApiService';
import { Singletons, SingletonKey } from '../../tools/singleton/Singletons';
import { Wallet } from '../../common/model/Wallet';
import { LogKind } from '../../tools/logger/LogKind';
import { RequestState } from '../model/RequestState';
import { INotificationService } from '../../services/INotificationService';
import { Currency } from '../../common/model/Currency';
import { RequestedList } from '../model/RequestedList';

export class CurrencyListHook extends Hook<RequestedList<Currency>> {
	private apiSvc: IApiService;
	private notificationSvc: INotificationService;

	constructor(d: [RequestedList<Currency>, StateUpdater<RequestedList<Currency>>]) {
		super(d[0], d[1]);
		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.notificationSvc = Singletons.Load<INotificationService>(SingletonKey.notification);

		this.apiSvc.get<void, Array<Currency>>(
			'currency/list',
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

	static defaultState(): RequestedList<Currency> {
		const g = new RequestedList<Currency>();
		return g;
	}

	protected stateChanged(): void {}

	public unmount(): void {}
}
