import { Deal } from '../../common/model/Deal';
import { RequestedList } from './RequestedList';

export class UserWalletDetailsState extends RequestedList<Deal> {
	public currency: string;
}
