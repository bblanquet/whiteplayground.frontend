import { Hook } from '../utils/Hook';
import { StateUpdater } from 'preact/hooks';
import { UserWalletState } from '../model/UserWalletState';
import { WalletStatus } from '../model/WalletStatus';

export class UserWalletHook extends Hook<UserWalletState> {
	constructor(d: [UserWalletState, StateUpdater<UserWalletState>]) {
		super(d[0], d[1]);
	}

	static defaultState(): UserWalletState {
		const g = new UserWalletState();
		g.currency = null;
		g.status = WalletStatus.list;
		return g;
	}

	back(): void {
		this.update((e) => {
			e.currency = null;
		});
	}

	public setCurrency(ccy: string) {
		this.update((e) => {
			e.currency = ccy;
		});
	}

	setStatus(add: WalletStatus): void {
		this.update((e) => {
			e.status = add;
		});
	}

	public hasCurrency(): boolean {
		return this.state.currency !== null && this.state.currency !== undefined && 0 < this.state.currency.length;
	}

	protected stateChanged(): void {}

	public unmount(): void {}
}
