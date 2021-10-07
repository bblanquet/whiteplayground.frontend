import { Currency } from '../../common/model/Currency';
import { RequestedList } from './RequestedList';

export class AddWalletState extends RequestedList<Currency> {
	public selectedCurrency: string;
}
