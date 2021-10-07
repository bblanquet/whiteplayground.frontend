import { h } from 'preact';
import Icon from '../common/Icon';
import { HookedComponent } from '../utils/HookedComponent';
import { useState } from 'preact/hooks';
import * as luxon from 'luxon';
import { AllWalletsHook } from '../hook/AllWalletsHook';
import Loading from '../common/Loading';
import { Wallet } from '../../common/model/Wallet';
import { RequestedList } from '../model/RequestedList';

export default class AllWallets extends HookedComponent<{}, AllWalletsHook, RequestedList<Wallet>> {
	getDefaultHook() {
		return new AllWalletsHook(useState(AllWalletsHook.defaultState()));
	}

	rendering() {
		return (
			<Loading value={this.hook.state.RequestState}>
				<table class="table table-striped table-borderless custom-table">
					<thead>
						<tr>
							<th>Lastest accounts</th>
						</tr>
					</thead>
					<tbody>
						{this.hook.state.data.map((r) => (
							<tr>
								<td>
									<span class="badge badge-secondary sm-m">
										<Icon value="far fa-clock" />
										<span class="sm-m-l">
											{luxon.DateTime
												.fromJSDate(new Date(r.date))
												.toFormat('yyyy LLL dd - HH:mm')}
										</span>
									</span>
									<span class="badge badge-secondary sm-m">
										<Icon value="fas fa-wallet" />
										<span class="sm-m-l">
											{r.name} - {r.currency}
										</span>
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</Loading>
		);
	}
}
