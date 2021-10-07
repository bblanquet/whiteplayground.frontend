import { Wallet } from '../../common/model/Wallet';

export class DepositState {
	public wallets: Array<Wallet> = new Array<Wallet>();
	public ccy: string;
	public amount: number;
}
