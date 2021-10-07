import { h } from 'preact';
import { HookedComponent } from '../utils/HookedComponent';
import { useState } from 'preact/hooks';
import { UserWalletState } from '../model/UserWalletState';
import WalletList from './walletList';
import UserWalletDetails from './userWalletDetails';
import AddWallet from './addWallet';
import Switch from '../common/Switch';
import { UserWalletHook } from '../hook/UserWalletHook';
import { WalletStatus } from '../model/WalletStatus';
import Visible from '../common/Visible';
import UserWalletGraph from './userWalletGraph';

export default class UserWallet extends HookedComponent<{}, UserWalletHook, UserWalletState> {
	getDefaultHook() {
		return new UserWalletHook(useState(UserWalletHook.defaultState()));
	}

	rendering() {
		return (
			<Switch
				isLeft={!this.hook.hasCurrency()}
				left={
					<div>
						<nav class="nav nav-pills flex-column flex-sm-row sm-p sub-container-style">
							<a
								class={`flex-sm-fill text-sm-center nav-link  ${this.hook.state.status ==
								WalletStatus.list
									? 'active'
									: ''}`}
								onClick={() => this.hook.setStatus(WalletStatus.list)}
							>
								List
							</a>
							<a
								class={`flex-sm-fill text-sm-center nav-link  ${this.hook.state.status ==
								WalletStatus.add
									? 'active'
									: ''}`}
								onClick={() => this.hook.setStatus(WalletStatus.add)}
							>
								Add
							</a>
						</nav>
						<Visible isVisible={this.hook.state.status == WalletStatus.list}>
							<WalletList
								setCcy={(ccy: string) => {
									this.hook.setCurrency(ccy);
								}}
							/>
						</Visible>
						<Visible isVisible={this.hook.state.status == WalletStatus.add}>
							<AddWallet callback={() => this.hook.setStatus(WalletStatus.list)} />
						</Visible>
					</div>
				}
				right={
					<div>
						<nav class="nav nav-pills flex-column flex-sm-row sm-p sub-container-style">
							<a class={`flex-sm-fill text-sm-center nav-link active `} onClick={() => this.hook.back()}>
								Back
							</a>
						</nav>
						<UserWalletGraph currency={this.hook.state.currency} />
						<UserWalletDetails currency={this.hook.state.currency} />
					</div>
				}
			/>
		);
	}
}
