import { h } from 'preact';
import { HookedComponent } from '../utils/HookedComponent';
import { useState } from 'preact/hooks';
import { UserOperationHook } from '../hook/userOperationHook';
import { OperationState } from '../model/OperationState';
import { OperationStatus } from '../model/OperationStatus';
import Visible from '../common/Visible';
import Deposit from './deposit';
import Withdraw from './withdraw';
import Transfer from './transfer';

export default class UserOperation extends HookedComponent<{}, UserOperationHook, OperationState> {
	getDefaultHook() {
		return new UserOperationHook(useState(UserOperationHook.defaultState()));
	}

	rendering() {
		return (
			<div>
				<nav class="nav nav-pills flex-column flex-sm-row sm-p sub-container-style">
					<a
						class={`flex-sm-fill text-sm-center nav-link   ${this.hook.state.status ==
						OperationStatus.deposit
							? 'active'
							: ''}`}
						onClick={() => this.hook.setStatus(OperationStatus.deposit)}
					>
						Deposit
					</a>
					<a
						class={`flex-sm-fill text-sm-center nav-link  ${this.hook.state.status ==
						OperationStatus.withdraw
							? 'active'
							: ''}`}
						onClick={() => this.hook.setStatus(OperationStatus.withdraw)}
					>
						Withdraw
					</a>
					<a
						class={`flex-sm-fill text-sm-center nav-link  ${this.hook.state.status ==
						OperationStatus.transfer
							? 'active'
							: ''}`}
						onClick={() => this.hook.setStatus(OperationStatus.transfer)}
					>
						Transfer
					</a>
				</nav>

				<Visible isVisible={this.hook.state.status === OperationStatus.deposit}>
					<Deposit
						callback={() => {
							this.hook.setStatus(OperationStatus.none);
						}}
					/>
				</Visible>
				<Visible isVisible={this.hook.state.status === OperationStatus.withdraw}>
					<Withdraw
						callback={() => {
							this.hook.setStatus(OperationStatus.none);
						}}
					/>
				</Visible>
				<Visible isVisible={this.hook.state.status === OperationStatus.transfer}>
					<Transfer
						callback={() => {
							this.hook.setStatus(OperationStatus.none);
						}}
					/>
				</Visible>
			</div>
		);
	}
}
