import { Hook } from '../utils/Hook';
import { StateUpdater } from 'preact/hooks';
import { IApiService } from '../../services/IApiService';
import { SingletonKey, Singletons } from '../../tools/singleton/Singletons';
import { INotificationService } from '../../services/INotificationService';
import { InfoState } from '../model/InfoState';
import { LogKind } from '../../tools/logger/LogKind';
import { DepositState } from '../model/DepositState';
import { Wallet } from '../../common/model/Wallet';

export class WithdrawHook extends Hook<DepositState> {
	private apiSvc: IApiService;
	private notificationSvc: INotificationService;

	constructor(private callback: () => void, d: [DepositState, StateUpdater<DepositState>]) {
		super(d[0], d[1]);
		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.notificationSvc = Singletons.Load<INotificationService>(SingletonKey.notification);
		this.apiSvc.get<void, Array<Wallet>>(
			'account/list',
			null,
			(r) => {
				this.update((e) => {
					if (r && 0 < r.length) {
						e.ccy = r[0].currency;
					}
					e.wallets = r;
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

	setAmount(value: number): void {
		this.update((e) => (e.amount = value));
	}

	setCcy(ccy: string): void {
		this.update((e) => (e.ccy = ccy));
	}

	public withdraw(): void {
		this.apiSvc.post<{ currency: string; amount: number }, string>(
			'operation/withdraw',
			{ currency: this.state.ccy, amount: this.state.amount },
			(r) => {
				this.callback();
				this.notificationSvc.onNotification.Invoke(
					this,
					new InfoState(LogKind.success, `the operation has been taken into account.`)
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

	static defaultState(): DepositState {
		return new DepositState();
	}

	protected stateChanged(): void {}

	public unmount(): void {}
}
