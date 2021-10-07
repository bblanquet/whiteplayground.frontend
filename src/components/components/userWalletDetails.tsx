import { h } from 'preact';
import Icon from '../common/Icon';
import { HookedComponent } from '../utils/HookedComponent';
import { useState } from 'preact/hooks';
import * as luxon from 'luxon';
import getSymbolFromCurrency from 'currency-symbol-map';
import { UserWalletDetailsState } from '../model/UserWalletDetailsState';
import { UserWalletDetailsHook } from '../hook/UserWalletDetailsHook';
import { toReadableNumber } from '../../tools/numberUtils';
import Loading from '../common/Loading';

export default class UserWalletDetails extends HookedComponent<
	{ currency: string },
	UserWalletDetailsHook,
	UserWalletDetailsState
> {
	getDefaultHook() {
		return new UserWalletDetailsHook(useState(UserWalletDetailsHook.defaultState(this.props.currency)));
	}

	componentDidUpdate() {
		if (this.props.currency !== this.hook.state.currency) {
			this.hook.setCcy(this.props.currency);
		}
	}

	rendering() {
		return (
			<Loading value={this.hook.state.RequestState}>
				<div class="table-responsive">
					<table class="table table-striped table-borderless custom-table">
						<thead>
							<tr>
								<th>Date</th>
								<th>Operation</th>
								<th>Amount</th>
							</tr>
						</thead>
						<tbody>
							{this.hook.state.data.map((r) => (
								<tr>
									<td class="align-middle">
										<span class="sm-m-l">
											{luxon.DateTime
												.fromJSDate(new Date(r.date))
												.toFormat('yyyy LLL dd - HH:mm')}
										</span>
									</td>
									<td class="align-middle">
										<span class="sm-m-l">
											{r.kind === 'transfer' ? r.amount < 0 ? (
												<span>
													<Icon value="fas fa-arrow-right" />
													<span class="badge badge-secondary sm-m">
														Rate: {r.rate ? toReadableNumber(r.rate) : 1}
													</span>
													<Icon value="fas fa-arrow-right" /> {r.counterpart} - {r.currency}
												</span>
											) : (
												<span>
													{r.counterpart} - {r.currency} <Icon value="fas fa-arrow-right" />
													<span class="badge badge-secondary sm-m">
														Rate: {r.rate ? toReadableNumber(r.rate) : 1}
													</span>
													<Icon value="fas fa-arrow-right" />
												</span>
											) : (
												r.kind
											)}
										</span>
									</td>
									<td class="align-middle">
										{this.hook.isAsset(r) ? (
											<span style="font-weight:bold;color:#19bd42">
												<Icon value="fas fa-arrow-up" /> {toReadableNumber(Math.abs(r.amount))}{' '}
												{getSymbolFromCurrency(this.hook.state.currency)}
											</span>
										) : (
											<span style="font-weight:bold;color:#bd1919">
												<Icon value="fas fa-arrow-down" />
												{toReadableNumber(Math.abs(r.amount))}{' '}
												{getSymbolFromCurrency(this.hook.state.currency)}
											</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Loading>
		);
	}
}
