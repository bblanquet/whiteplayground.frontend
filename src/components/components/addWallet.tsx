import { h, Component } from 'preact';
import { useState } from 'preact/hooks';
import Icon from '../common/Icon';
import Line from '../common/Line';
import Visible from '../common/Visible';
import { AddWalletHook } from '../hook/AddWalletHook';
import { AddWalletState } from '../model/AddWalletState';
import { HookedComponent } from '../utils/HookedComponent';

export default class AddWallet extends HookedComponent<{ callback: () => void }, AddWalletHook, AddWalletState> {
	public rendering(): h.JSX.Element {
		return (
			<form
				onSubmit={(e) => {
					e.preventDefault();
					return false;
				}}
			>
				<Line>
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<label class="input-group-text" for="inputGroupSelect01">
								Currencies
							</label>
						</div>
						<select
							onChange={(e: any) => this.hook.setCcy(e.target.value)}
							class="custom-select"
							id="inputGroupSelect01"
						>
							{this.hook.state.data.map((e) => (
								<option value={e.code} selected>
									{e.code} - {e.description}
								</option>
							))}
						</select>
					</div>
				</Line>
				<Visible isVisible={this.hook.hasSelectedCcy()}>
					<Line>
						<button
							class="btn btn-secondary sm-m"
							onClick={(e) => {
								this.hook.add();
							}}
						>
							<Icon value={'fas fa-file-signature'} />
							Add
						</button>
					</Line>
				</Visible>
			</form>
		);
	}

	public getDefaultHook(): AddWalletHook {
		return new AddWalletHook(this.props.callback, useState(AddWalletHook.defaultState()));
	}
}
