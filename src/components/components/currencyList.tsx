import { h } from 'preact';
import Icon from '../common/Icon';
import { HookedComponent } from '../utils/HookedComponent';
import { useState } from 'preact/hooks';
import Loading from '../common/Loading';
import { RequestedList } from '../model/RequestedList';
import { Currency } from '../../common/model/Currency';
import { CurrencyListHook } from '../hook/CurrencyListHook';
import getSymbolFromCurrency from 'currency-symbol-map';

export default class CurrencyList extends HookedComponent<{}, CurrencyListHook, RequestedList<Currency>> {
	getDefaultHook() {
		return new CurrencyListHook(useState(CurrencyListHook.defaultState()));
	}

	rendering() {
		return (
			<Loading value={this.hook.state.RequestState}>
				<div class="table-responsive">
					<table class="table table-striped table-borderless custom-table">
						<thead>
							<tr>
								<th>
									<Icon value="fas fa-money-bill-wave-alt" />
								</th>
								<th>
									<Icon value="fas fa-tags" />
								</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							{this.hook.state.data.map((r) => (
								<tr>
									<td class="align-middle">{getSymbolFromCurrency(r.code)}</td>
									<td class="align-middle">{r.code}</td>
									<td class="align-middle">{r.description}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Loading>
		);
	}
}
