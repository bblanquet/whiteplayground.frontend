import { Hook } from '../utils/Hook';
import { StateUpdater } from 'preact/hooks';
import { IApiService } from '../../services/IApiService';
import { SingletonKey, Singletons } from '../../tools/singleton/Singletons';
import { INotificationService } from '../../services/INotificationService';
import { InfoState } from '../model/InfoState';
import { LogKind } from '../../tools/logger/LogKind';
import { Wallet } from '../../common/model/Wallet';
import { TransferState } from '../model/TransferState';
import getSymbolFromCurrency from 'currency-symbol-map';
import { toReadableNumber } from '../../tools/numberUtils';

export class TransferHook extends Hook<TransferState> {
	private apiSvc: IApiService;
	private notificationSvc: INotificationService;

	constructor(private callback: () => void, d: [TransferState, StateUpdater<TransferState>]) {
		super(d[0], d[1]);
		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.notificationSvc = Singletons.Load<INotificationService>(SingletonKey.notification);
		this.from();
		this.to();
	}

	private from() {
		this.apiSvc.get<void, Array<Wallet>>(
			'account/list',
			null,
			(r) => {
				this.update((e) => {
					if (r && 0 < r.length) {
						e.from = r[0];
					}
					e.fromList = r;
				});
				this.rate();
			},
			(e) => {
				this.notificationSvc.onNotification.Invoke(
					this,
					new InfoState(LogKind.error, `${e.name} - ${e.description}`)
				);
			}
		);
	}

	private to() {
		this.apiSvc.get<void, Array<Wallet>>(
			'account/all',
			null,
			(r) => {
				this.update((e) => {
					if (r && 0 < r.length) {
						e.to = r[0];
					}
					e.toList = r;
				});
				this.rate();
			},
			(e) => {
				this.notificationSvc.onNotification.Invoke(
					this,
					new InfoState(LogKind.error, `${e.name} - ${e.description}`)
				);
			}
		);
	}

	public ExistFrom(): boolean {
		return (
			this.state.from &&
			this.state.from.currency !== null &&
			this.state.from.currency !== undefined &&
			this.state.from.currency.length === 3
		);
	}

	public getFromSymbol(): string {
		let symbol = '';
		if (this.ExistFrom()) {
			symbol = getSymbolFromCurrency(this.state.from.currency);
		}
		return symbol;
	}

	public getToSymbol(): string {
		let symbol = '';
		if (this.ExistTo()) {
			symbol = getSymbolFromCurrency(this.state.to.currency);
		}
		return symbol;
	}

	public getWalletDescription(e: Wallet): string {
		if (e.amount !== null && e.amount !== undefined) {
			return `${e.name} - ${e.currency} - ${toReadableNumber(e.amount)} ${getSymbolFromCurrency(e.currency)}`;
		} else {
			return `${e.name} - ${e.currency} - ${getSymbolFromCurrency(e.currency)}`;
		}
	}

	public ExistTo(): boolean {
		return (
			this.state.to &&
			this.state.to.currency !== null &&
			this.state.to.currency !== undefined &&
			this.state.to.currency.length === 3
		);
	}

	private existRate(): boolean {
		return this.state.rate !== undefined && this.state.rate !== null;
	}

	private existAmount(): boolean {
		return this.state.amount !== undefined && this.state.amount !== null;
	}

	public getRate(): string {
		if (this.existRate()) {
			return toReadableNumber(this.state.rate);
		} else {
			return 'NA';
		}
	}

	public getRateAmount(): string {
		if (this.existAmount() && this.existRate()) {
			return toReadableNumber(this.state.rate * this.state.amount);
		} else {
			return 'NA';
		}
	}

	private rate() {
		if (this.ExistFrom() && this.ExistTo()) {
			if (this.state.from.currency !== this.state.to.currency) {
				this.apiSvc.get<{ currencyA: string; currencyB: string }, { rate: number }>(
					'currency/rate',
					{ currencyA: this.state.from.currency, currencyB: this.state.to.currency },
					(r) => {
						this.update((e) => {
							e.rate = r.rate;
						});
					},
					(e) => {
						this.notificationSvc.onNotification.Invoke(
							this,
							new InfoState(LogKind.error, `${e.name} - ${e.description}`)
						);
					}
				);
			} else {
				this.update((e) => {
					e.rate = 1;
				});
			}
		}
	}

	public setAmount(value: number): void {
		this.update((e) => (e.amount = value));
	}

	public setFromCcy(index: number): void {
		this.update((e) => (e.from = e.fromList[index]));
		this.rate();
	}

	public setToCcy(index: number): void {
		this.update((e) => (e.to = e.toList[index]));
		this.rate();
	}

	public transfer(): void {
		this.apiSvc.post<
			{ emitter: string; receiver: string; emittedCurrency: string; receivedCurrency: string; amount: number },
			string
		>(
			'operation/transfer',
			{
				emitter: this.state.from.name,
				receiver: this.state.to.name,
				emittedCurrency: this.state.from.currency,
				receivedCurrency: this.state.to.currency,
				amount: this.state.amount
			},
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

	static defaultState(): TransferState {
		return new TransferState();
	}

	protected stateChanged(): void {}

	public unmount(): void {}
}
