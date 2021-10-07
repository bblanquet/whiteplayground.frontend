import { h, Component } from 'preact';
import { useState } from 'preact/hooks';
import Icon from '../common/Icon';
import Line from '../common/Line';
import Visible from '../common/Visible';
import { DepositHook } from '../hook/DepositHook';
import { DepositState } from '../model/DepositState';
import { HookedComponent } from '../utils/HookedComponent';
import getSymbolFromCurrency from 'currency-symbol-map';
import { toReadableNumber } from '../../tools/numberUtils';

export default class Deposit extends HookedComponent<{ callback: () => void }, DepositHook, DepositState> {
	public rendering(): h.JSX.Element {
		return (
			<form
				onSubmit={(e) => {
					e.preventDefault();
					return false;
				}}
			>
				<Line>
					<div class="col-md-4 mb-3">
						<label>Account</label>
						<select
							onChange={(e: any) => this.hook.setCcy(e.target.value)}
							class="custom-select"
							id="inputGroupSelect01"
						>
							{this.hook.state.wallets.map((e) => (
								<option value={e.currency} selected={this.hook.state.ccy === e.currency}>
									{e.name} - {e.currency} - {toReadableNumber(e.amount)}{' '}
									{getSymbolFromCurrency(e.currency)}
								</option>
							))}
						</select>
					</div>
				</Line>
				<Visible isVisible={this.hook.state.ccy !== undefined && this.hook.state.ccy !== null}>
					<Line>
						<div class="col-md-4 mb-3">
							<label>Amount</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text">
										{this.hook.state.ccy ? getSymbolFromCurrency(this.hook.state.ccy) : ''}
									</span>
								</div>
								<input
									type="number"
									class="form-control"
									placeholder="40"
									value={this.hook.state.amount}
									onInput={(e: any) => this.hook.setAmount(e.target.value)}
									required
								/>
							</div>
						</div>
					</Line>
					<Line>
						<button
							class="btn btn-primary sm-m"
							onClick={(e) => {
								this.hook.deposit();
							}}
						>
							<Icon value={'fas fa-plus'} /> Deposit
						</button>
					</Line>
				</Visible>
			</form>
		);
	}
	public getDefaultHook(): DepositHook {
		return new DepositHook(this.props.callback, useState(DepositHook.defaultState()));
	}
}
