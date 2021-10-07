import { h } from 'preact';
import Icon from '../common/Icon';
import { HookedComponent } from '../utils/HookedComponent';
import { useState } from 'preact/hooks';
import * as luxon from 'luxon';
import getSymbolFromCurrency from 'currency-symbol-map';
import { WalletListHook } from '../hook/WalletListHook';
import { toReadableNumber } from '../../tools/numberUtils';
import Loading from '../common/Loading';
import { Wallet } from '../../common/model/Wallet';
import { RequestedList } from '../model/RequestedList';

export default class WalletList extends HookedComponent<
	{ setCcy: (c: string) => void },
	WalletListHook,
	RequestedList<Wallet>
> {
	getDefaultHook() {
		return new WalletListHook(this.props.setCcy, useState(WalletListHook.defaultState()));
	}

	rendering() {
		return (
			<Loading value={this.hook.state.RequestState}>
				<div class="table-responsive">
					<table class="table table-striped table-borderless custom-table">
						<thead>
							<tr>
								<th>
									<Icon value="far fa-clock" /> Date
								</th>
								<th>
									<Icon value="fas fa-money-bill-wave-alt" /> Currency
								</th>
								<th>
									<Icon value="fas fa-balance-scale" /> Balance
								</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{this.hook.state.data.map((r) => (
								<tr>
									<td class="align-middle">
										{luxon.DateTime.fromJSDate(new Date(r.date)).toFormat('yyyy LLL dd - HH:mm')}
									</td>
									<td class="align-middle">{r.currency}</td>
									<td class="align-middle">
										{toReadableNumber(r.amount)} {getSymbolFromCurrency(r.currency)}
									</td>
									<td class="align-middle align-right">
										<button
											type="button"
											class="btn btn-secondary sm-m"
											onClick={() => this.hook.details(r.currency)}
										>
											<Icon value="fas fa-exchange-alt" />
										</button>
										<button
											type="button"
											class="btn btn-danger sm-m"
											onClick={() => this.hook.delete(r.currency)}
										>
											<Icon value="fas fa-trash-alt" />
										</button>
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
