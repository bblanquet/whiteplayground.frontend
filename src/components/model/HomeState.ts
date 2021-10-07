import { PageStatus } from './PageStatus';

export class HomeState {
	public status: PageStatus = PageStatus.home;
	public hasToken: boolean = false;
}
