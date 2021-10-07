import { h } from 'preact';
import { HookedComponent } from '../utils/HookedComponent';
import { useState } from 'preact/hooks';
import Loading from '../common/Loading';
import ChartContainer from '../common/ChartContainer';
import { DateValue } from '../../tools/charts/DateValue';
import { RequestedList } from '../model/RequestedList';
import { UserWalletGraphHook } from '../hook/UserWalletGraphHook';

export default class UserWalletGraph extends HookedComponent<
	{ currency: string },
	UserWalletGraphHook,
	RequestedList<DateValue>
> {
	getDefaultHook() {
		return new UserWalletGraphHook(useState(UserWalletGraphHook.defaultState(this.props.currency)));
	}

	componentDidUpdate() {
		if (this.props.currency !== this.hook.state.currency) {
			this.hook.setCcy(this.props.currency);
		}
	}

	rendering() {
		return (
			<Loading value={this.hook.state.RequestState}>
				<ChartContainer canvas={this.hook.state.canvas} height={30} />
			</Loading>
		);
	}
}
