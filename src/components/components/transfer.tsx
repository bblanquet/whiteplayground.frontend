import { h, Component } from 'preact';
import { useState } from 'preact/hooks';
import Icon from '../common/Icon';
import Line from '../common/Line';
import Visible from '../common/Visible';
import { HookedComponent } from '../utils/HookedComponent';
import getSymbolFromCurrency from 'currency-symbol-map';
import { TransferState } from '../model/TransferState';
import { TransferHook } from '../hook/TransferHook';
import { toReadableNumber } from '../../tools/numberUtils';

export default class Transfer extends HookedComponent<{ callback: () => void }, TransferHook, TransferState> {
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
						<label>Emitter</label>
						<select
							onChange={(e: any) => this.hook.setFromCcy(e.target.value)}
							class="custom-select"
							id="inputGroupSelect01"
						>
							{this.hook.state.fromList.map((e, i) => (
								<option value={i} selected={this.hook.state.from === e}>
									{this.hook.getWalletDescription(e)}
								</option>
							))}
						</select>
					</div>
				</Line>
				<Line>
					<div class="col-md-4 mb-3">
						<label>Receiver</label>
						<select
							onChange={(e: any) => this.hook.setToCcy(e.target.value)}
							class="custom-select"
							id="inputGroupSelect01"
						>
							{this.hook.state.toList.map((e, i) => (
								<option value={i} selected={this.hook.state.to === e}>
									{this.hook.getWalletDescription(e)}
								</option>
							))}
						</select>
					</div>
				</Line>
				<Visible isVisible={this.hook.ExistFrom() && this.hook.ExistTo()}>
					<Line>
						<div class="col-md-4 mb-3">
							<label for="amount">Amount</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text">{this.hook.getFromSymbol()}</span>
								</div>
								<input
									type="number"
									class="form-control"
									id="amount"
									placeholder="40"
									value={this.hook.state.amount}
									onInput={(e: any) => this.hook.setAmount(e.target.value)}
									required
								/>
							</div>
						</div>
					</Line>
					<Line>
						<div class="col-md-4 mb-3">
							<ul style="width:100%" class="list-group">
								<li class="list-group-item d-flex justify-content-between align-items-center">
									Rate
									<span class="badge badge-secondary badge-pill">{this.hook.getRate()}</span>
								</li>
								<li class="list-group-item d-flex justify-content-between align-items-center">
									Amount
									<span class="badge badge-secondary badge-pill">
										{this.hook.getRateAmount()} {this.hook.getToSymbol()}
									</span>
								</li>
							</ul>
						</div>
					</Line>
					<Line>
						<button
							class="btn btn-primary sm-m"
							onClick={(e) => {
								this.hook.transfer();
							}}
						>
							<Icon value={'fas fa-random'} /> transfer
						</button>
					</Line>
				</Visible>
			</form>
		);
	}
	public getDefaultHook(): TransferHook {
		return new TransferHook(this.props.callback, useState(TransferHook.defaultState()));
	}
}
