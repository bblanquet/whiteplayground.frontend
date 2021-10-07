import { RequestState } from './RequestState';

export class RequestedList<T> {
	public data: Array<T> = [];
	public RequestState: RequestState = RequestState.LOADING;
}
