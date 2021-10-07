import { DateValue } from '../../tools/charts/DateValue';
import { RequestedList } from './RequestedList';

export class UserWalletGraphState extends RequestedList<DateValue> {
	public currency: string;
	public canvas: HTMLCanvasElement;
}
