import { Hook } from '../utils/Hook';
import { StateUpdater } from 'preact/hooks';
import { OperationState } from '../model/OperationState';
import { OperationStatus } from '../model/OperationStatus';

export class UserOperationHook extends Hook<OperationState> {
	constructor(d: [OperationState, StateUpdater<OperationState>]) {
		super(d[0], d[1]);
	}

	static defaultState(): OperationState {
		const g = new OperationState();
		g.status = OperationStatus.none;
		return g;
	}

	public setStatus(status: OperationStatus): void {
		this.update((e) => {
			e.status = status;
		});
	}

	protected stateChanged(): void {}

	public unmount(): void {}
}
