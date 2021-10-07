import { Wallet } from '../../common/model/Wallet';

export class TransferState {
	public fromList: Array<Wallet> = new Array<Wallet>();
	public from: Wallet;
	public toList: Array<Wallet> = new Array<Wallet>();
	public to: Wallet;
	public rate: number;
	public amount: number;
}
