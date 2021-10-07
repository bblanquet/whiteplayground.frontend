import { Hook } from '../utils/Hook';
import { StateUpdater } from 'preact/hooks';
import { IApiService } from '../../services/IApiService';
import { SingletonKey, Singletons } from '../../tools/singleton/Singletons';
import { INotificationService } from '../../services/INotificationService';
import { InfoState } from '../model/InfoState';
import { LogKind } from '../../tools/logger/LogKind';
import { AddWalletState } from '../model/AddWalletState';
import { Currency } from '../../common/model/Currency';

export class AddWalletHook extends Hook<AddWalletState> {
	private apiSvc: IApiService;
	private notificationSvc: INotificationService;

	constructor(private callback: () => void, d: [AddWalletState, StateUpdater<AddWalletState>]) {
		super(d[0], d[1]);
		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.notificationSvc = Singletons.Load<INotificationService>(SingletonKey.notification);
		this.fetchCurrencies();
	}

	static defaultState(): AddWalletState {
		return new AddWalletState();
	}

	public fetchCurrencies(): void {
		this.apiSvc.get<void, Array<Currency>>(
			'currency/list',
			null,
			(r) => {
				this.update((e) => {
					e.data = r;
				});
			},
			(e) => {
				this.notificationSvc.onNotification.Invoke(
					this,
					new InfoState(LogKind.error, `${e.name} - ${e.description}`)
				);
			}
		);
	}

	setCcy(value: string): void {
		this.update((e) => (e.selectedCurrency = value));
	}

	hasSelectedCcy(): boolean {
		return this.state.selectedCurrency && 3 === this.state.selectedCurrency.length;
	}

	public add(): void {
		this.apiSvc.post<{ currency: string }, { token: string }>(
			'account/add',
			{ currency: this.state.selectedCurrency },
			(r) => {
				this.callback();
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
