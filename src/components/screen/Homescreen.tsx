import { h } from 'preact';
import Body from '../common/Body';
import Line from '../common/Line';
import { HomeState } from '../model/HomeState';
import { HookedComponent } from '../utils/HookedComponent';
import { HomeHook } from '../Hook/HomeHook';
import { useState } from 'preact/hooks';
import AllWallets from '../components/allWallets';
import Btn from '../common/Btn';
import Icon from '../common/Icon';
import { PageStatus } from '../model/PageStatus';
import Visible from '../common/Visible';
import Login from '../components/login';
import Notification from '../common/Notification';
import UserWallet from '../components/userWallets';
import UserOperation from '../components/userOperation';
import CurrencyList from '../components/CurrencyList';

export default class HomeScreen extends HookedComponent<{}, HomeHook, HomeState> {
	getDefaultHook() {
		return new HomeHook(useState(HomeHook.defaultState()));
	}

	rendering() {
		return (
			<Body
				header={
					<nav class="navbar navbar-expand-lg navbar-light bg-light">
						<a class="navbar-brand sm-icon" href="#" />
						<button
							class="navbar-toggler"
							type="button"
							data-toggle="collapse"
							data-target="#navbarNavAltMarkup"
							aria-controls="navbarNavAltMarkup"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span class="navbar-toggler-icon" />
						</button>
						<div class="collapse navbar-collapse" id="navbarNavAltMarkup">
							<div class="navbar-nav">
								<Btn
									isSelected={this.hook.state.status == PageStatus.home}
									onClick={() => {
										this.hook.setStatus(PageStatus.home);
									}}
								>
									<Icon value={'fas fa-wallet'} /> Home
								</Btn>
								<Btn
									isSelected={this.hook.state.status == PageStatus.currency}
									onClick={() => {
										this.hook.setStatus(PageStatus.currency);
									}}
								>
									<Icon value={'fas fa-money-bill-wave-alt'} /> Currencies
								</Btn>
								<Visible isVisible={this.hook.state.hasToken}>
									<Btn
										isSelected={this.hook.state.status == PageStatus.wallet}
										onClick={() => {
											this.hook.setStatus(PageStatus.wallet);
										}}
									>
										<Icon value={'fas fa-wallet'} /> Wallets
									</Btn>
									<Btn
										isSelected={this.hook.state.status == PageStatus.operation}
										onClick={() => {
											this.hook.setStatus(PageStatus.operation);
										}}
									>
										<Icon value={'fas fa-exchange-alt'} /> Operations
									</Btn>
								</Visible>

								<Btn
									isSelected={this.hook.state.status == PageStatus.login}
									onClick={() => {
										this.hook.setStatus(PageStatus.login);
									}}
								>
									<Icon value={'fas fa-user-circle'} /> Login
								</Btn>
							</div>
						</div>
					</nav>
				}
				content={
					<Line>
						<div class="container-style container-size">
							<Visible isVisible={this.hook.state.status === PageStatus.home}>
								<AllWallets />
							</Visible>
							<Visible isVisible={this.hook.state.status === PageStatus.currency}>
								<CurrencyList />
							</Visible>
							<Visible isVisible={this.hook.state.status === PageStatus.login}>
								<Login />
							</Visible>
							<Visible isVisible={this.hook.state.status === PageStatus.wallet}>
								<UserWallet />
							</Visible>
							<Visible isVisible={this.hook.state.status === PageStatus.operation}>
								<UserOperation />
							</Visible>
						</div>
						<Notification />
					</Line>
				}
				footer={
					<div style="background-color:#ededed; padding:10px 10px 10px 10px">©2021 by White Playground</div>
				}
			/>
		);
	}
}
