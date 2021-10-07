import { Hook } from '../utils/Hook';
import { StateUpdater } from 'preact/hooks';
import { InfoState } from '../model/InfoState';
import { IApiService } from '../../services/IApiService';
import { Singletons, SingletonKey } from '../../tools/singleton/Singletons';
import { LogKind } from '../../tools/logger/LogKind';
import { RequestState } from '../model/RequestState';
import { INotificationService } from '../../services/INotificationService';
import { DateValue } from '../../tools/charts/DateValue';
import { LineChart } from '../../tools/charts/LineChart';
import { UserWalletGraphState } from '../model/UserWalletGraphState';
import { Curve } from '../../tools/charts/Curve';

export class UserWalletGraphHook extends Hook<UserWalletGraphState> {
	private apiSvc: IApiService;
	private notificationSvc: INotificationService;
	private lineChart: LineChart;
	constructor(d: [UserWalletGraphState, StateUpdater<UserWalletGraphState>]) {
		super(d[0], d[1]);
		this.lineChart = new LineChart();
		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.notificationSvc = Singletons.Load<INotificationService>(SingletonKey.notification);
		this.fetch();
	}

	setCcy(currency: string): void {
		this.update((e) => {
			e.currency = currency;
		});
		this.fetch();
	}

	fetch() {
		this.update((e) => {
			e.RequestState = RequestState.LOADING;
		});

		this.apiSvc.get<{ currency: string }, Array<DateValue>>(
			'account/curve',
			{ currency: this.state.currency },
			(r) => {
				this.update((e) => {
					const curves = new Curve(r, '#0d6efd');
					e.data = r;
					e.canvas = this.lineChart.GetCanvas(this.state.currency, [ curves ]);
					e.RequestState = RequestState.LOADED;
				});
			},
			(e) => {
				this.update((e) => {
					e.RequestState = RequestState.ERROR;
				});
				this.notificationSvc.onNotification.Invoke(
					this,
					new InfoState(LogKind.error, `${e.name} - ${e.description}`)
				);
			}
		);
	}

	static defaultState(ccy: string): UserWalletGraphState {
		const g = new UserWalletGraphState();
		g.data = new Array<DateValue>();
		g.currency = ccy;
		return g;
	}

	protected stateChanged(): void {}

	public unmount(): void {}
}
